'use strict'

const openModal = () => {
    document.getElementById('modal').classList.add('active')
}

const closeModal = () => {
    document.getElementById('modal').classList.remove('active')
    clearFields()
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_prod')) ?? []
const setLocalStorage = (dbProd) => localStorage.setItem("db_prod", JSON.stringify(dbProd))


//METODOS DO CRUD

//CREATE
const createProd = (prod) => {
    const dbProd = getLocalStorage()
    dbProd.push(prod)
    setLocalStorage(dbProd)
}
//READ
const readProd = () => getLocalStorage()
//UPDATE
const updateProd = (index, prod) => {
    const dbProd = readProd()
    dbProd[index] = prod
    setLocalStorage(dbProd)
}
//DELETE
const deleteProd = (index) => {
    const dbProd = readProd()
    dbProd.splice(index, 1)
    setLocalStorage(dbProd)
}

//Interação com o Layout

const clearFields = () => {
    document.getElementById('produto').value = ""
    document.getElementById('fornecedor').value = ""
    document.getElementById('custo_unt').value = ""
    document.getElementById('quantidade').value = ""
}


const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

const saveProd = () => {
    if (isValidFields()) {
        const prod = {
            produto: document.getElementById('produto').value,
            fornecedor: document.getElementById('fornecedor').value,
            custo_unt: document.getElementById('custo_unt').value,
            quantidade: document.getElementById('quantidade').value
        }
        const index = document.getElementById('produto').dataset.index
        if (index == 'new') {
            closeModal()
            createProd(prod)
            updateTable()
        } else {
            updateProd(index, prod)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (prod, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${prod.produto}</td>
        <td>${prod.fornecedor}</td>
        <td>${prod.custo_unt}</td>
        <td>${prod.quantidade}</td>
        <td>
            <button id="botaoEditar-${index}" type="button" class="button green" >Editar</button>
            <button id="botaoSalvar-${index}" type="button" class="button red" >Excluir</button>
        </td>
    `
    document.querySelector('#tableProd>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableProd>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbProd = readProd()
    clearTable()
    dbProd.forEach(createRow)
}

updateTable()

const fillFields = (prod) => {
    document.getElementById('produto').value = prod.produto
    document.getElementById('fornecedor').value = prod.fornecedor
    document.getElementById('custo_unt').value = prod.custo_unt
    document.getElementById('quantidade').value = prod.quantidade
    document.getElementById('produto').dataset.index = prod.index
}

const editProd = (index) => {
    const prod = readProd()[index]
    prod.index = index
    fillFields(prod)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == "button") {
        const [action, index] = event.target.id.split('-')
        
        if (action == 'botaoEditar') {
            editProd(index)
        } else {
            deleteProd(index)
            updateTable()
        }
    }
}
//eventos
document.getElementById('botaoCadastrar')
    .addEventListener('click', openModal)

document.getElementById('botaoCancelar')
    .addEventListener('click', closeModal)

document.getElementById('botaoSalvar')
    .addEventListener('click', saveProd)

document.querySelector('#tableProd>tbody')
    .addEventListener('click', editDelete)

document.getElementById('close-modal')
    .addEventListener('click', closeModal)