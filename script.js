// Selecionar elementos do formulário
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")
const expenseList = document.querySelector('ul')
const expenseTotal = document.querySelector("aside header h2")
const expenseQuantity = document.querySelector("aside header p span")

//Captura o evento de input para formatar o valor
amount.oninput = () =>{
    //Obtem o valor do input e remove os caracteres não numericos
    let value = amount.value.replace(/\D/g,"")

    value = Number(value) / 100

    //Atualizar o valor do input
    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value){
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })

    return value
}

// Captura o evento de submit do formulario para obter os valores
form.onsubmit = (event) =>{
    //Previne o comportamento padrão de recarregar a página
    event.preventDefault()

    //Cria um objeto com os detalhes da nova despesa
    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    expenseAdd(newExpense)
}

//Adicionar um novo item na lista
function expenseAdd(newExpense){
    try {
        //Cria o elemento li na lista ul
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")
        
        //Cria o icone da categoria
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src",`./img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt",newExpense.category_name)

        //Cria o info das despesas
        const expenseInfo = document.createElement('div')
        expenseInfo.classList.add("expense-info")

        //Criar o nome das despesas
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        //Cria a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        //Adiciona nome e categoria nas div da despesas
        expenseInfo.append(expenseName, expenseCategory)

        //Cria o valor da despesa
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add('expense-amount')
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.replace(/R\$\s*/,"")}`

        //Cria o icone da lixeira
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src",`./img/remove.svg`)
        removeIcon.setAttribute("alt","remover")

        
        //Adiciona as informações no item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount,removeIcon)

        //Adiciona o item na lista
        expenseList.append(expenseItem)
        
        //Atualiza o valor total
        updateTotals()
        formClear()

    } catch (error) {
        console.log(error)
    }
}

// Atualiza o total
function updateTotals(){
    try {
        //Pegar todos os filhos da lista(ul)
        const items = expenseList.children

        //Atualiza a quantidade de itens na lista
        expenseQuantity.textContent = `${items.length} ${
            items.length > 1 ? "despesas" : "despesa"
        }`

        //Variavel para incrementar o total
        let total = 0

        for(let item = 0; item<items.length;item++){
            const itemAmount = items[item].querySelector(".expense-amount")

            if(!itemAmount) continue

            let value = itemAmount.textContent.replace(/R\$\s*/,"").trim().replace(/\./g,"").replace(",",".")

            value = parseFloat(value)

            if(!isNaN(value)) total += value
        }

        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        total = formatCurrencyBRL(total).toUpperCase().replace("R$","")
        
        expenseTotal.innerHTML = ""
        expenseTotal.append(symbolBRL,total)
        
    } catch (error) {
        console.log(error)
        alert("Não foi possível atualizar os totais")
    }
}

expenseList.addEventListener("click",function(event){

    if(event.target.classList.contains("remove-icon")){
        //Obtem a li pai do elemento clicado
        const item = event.target.closest(".expense")
        item.remove()
    }

    updateTotals()
})

function formClear(){
    expense.value = ""
    category.value = ""
    amount.value = ""

    expense.focus()
}