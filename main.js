const options = {
    data() {
        return {
            items: [], // id, item name, checked
        }
    },
    methods: {
        checkItem(item) {
            const itemIndex = this.items.indexOf(item);
            this.items[itemIndex].checked = true;
        },
        uncheckItem(item) {
            const itemIndex = this.items.indexOf(item);
            this.items[itemIndex].checked = false;
        },
        addItem(item) {
            this.items.unshift(item);
        },
        removeItem(item) {
            const itemIndex = this.items.indexOf(item);
            this.items.splice(itemIndex, 1);
        },
        getItemsList() {
            if (window.localStorage.todoItemsList) {
                const todoItemsListJSON = window.localStorage.getItem("todoItemsList");
                return JSON.parse(todoItemsListJSON);
            }
        },
        updateLocalStore() {
            window.localStorage.clear();
            window.localStorage.setItem("todoItemsList", JSON.stringify(this.items));
        }
    },
    computed: {
        allItemsChecked() {
            return this.items.filter(item => !item.checked).length === 0;
        },
        allItemsUnchecked() {
            return this.items.filter(item => item.checked).length === 0;
        }
    },
    watch: {
        items: {
            handler: function(newVal, oldVal) { // watch it
                this.updateLocalStore()
            },
            deep: true
        }
    },
    mounted() {
        let todoItemsList = this.getItemsList();
        this.items.push( ...todoItemsList );
    }
};

const app = Vue.createApp(options);

app.component("todo-item", {
    props: {
        itemObj: Object,
        checkItemCallback: Function,
        removeItemCallback: Function,
    },
    template: `
        <li v-show="!itemObj.checked" 
            :key = "itemObj.id" 
            class = "todo-item"
        >
            <button @click="checkItemCallback(itemObj)" class = "check-button">
                <i class="material-icons">done_outline</i>
            </button> 
            <div class="todo-item-text-container"><p class = "todo-item-text">{{ itemObj.itemName }}</p></div>
            <button @click="removeItemCallback(itemObj)" class = "delete-button">
                <i class="material-icons">delete_outline</i>
            </button>
        </li>
    `,
});

app.component("done-item", {
    props: {
        itemObj: Object,
        removeItemCallback:Function,
        uncheckItemCallback: Function,
    },
    template: `
        <li v-show="itemObj.checked" 
            :key= "itemObj.id" 
            class = "done-item"
        >
            <button @click="uncheckItemCallback(itemObj)" class = "uncheck-button">
                <i class="material-icons">disabled_by_default</i>
            </button>
            <div class="done-item-text-container"><p class = "done-item-text">{{ itemObj.itemName }}</p></div>
            <button @click="removeItemCallback(itemObj)" class = "delete-button">
                <i class="material-icons">delete_outline</i>
            </button>
        </li>
    `,
});

app.component("user-add-item", {
    props: {
        itemsList: Array, 
        addItemCallback: Function,
    },
    data() {
        return {
            inputValue: "",
            randomTodoItems: [
                "Learn to code...",
                "Learn to cook...",
                "Go for a walk...",
                "Read a book...",
                "Go catch a fish..."
            ]
        }
    },
    methods: {
        getId(itemsList) {
            const idArray = itemsList.map(val => val.id);
            return (Math.max( ...idArray ) + 1);
        },
        addInputValueToItems() {
            this.addItemCallback({
                id: this.getId(this.itemsList),
                itemName: this.inputValue,
                checked: false,
            });
            this.inputValue = "";
        },
        getRandomTodoItem() {
            const options = this.randomTodoItems;
            return options[Math.floor(Math.random() * options.length)];
        }
    },
    template: `
    <div id="add-item-container">
    <textarea 
        v-model="inputValue" 
        @keyup.enter="addInputValueToItems" 
        id="add-item-text-input"
        :placeholder="getRandomTodoItem()"
    ></textarea>
    <button 
        @click="addInputValueToItems" 
        id="add-item-button"
    >
        <slot></slot>
    </button>
    </div>
    `
})

const vm = app.mount("#app");