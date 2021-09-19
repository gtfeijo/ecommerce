import React from "react";
import Filtros from "./Components/Filtros/Filtros";
import Produtos from "./Components/Home/Produtos/Produtos";
import {pacoteDeProdutos} from "./pacoteDeProdutos"
import { ConjuntoDeComponentes } from "./estiloDoApp"
import Carrinho from "./Components/Carrinho/Carrinho"




class App extends React.Component{
  state={
    filtroMinimo: 0,
    filtroMaximo: 1000000,
    filtroBuscaPorNome: "",
    ordenacao: "Crescente",
    carrinho: [],
    valorTotal: 0
  }

  manipularValorDoFiltroMinimo = (e) => {
    this.setState({ filtroMinimo: e.target.value })
  }

  manipularValorDoFiltroMaximo = (e) => {
    this.setState({ filtroMaximo: e.target.value })
  }

  manipularValorDoFiltroBuscaPorNome = (e) => {
    this.setState({ filtroBuscaPorNome: e.target.value })
  }

  filtrarProdutos = () =>{
   
    const pacotesFiltradosMinimo = pacoteDeProdutos.filter((produto) =>{
      if(this.state.filtroMinimo){
        return produto.price >= this.state.filtroMinimo
      }else{
        return produto
      }
      
    })
    
    const pacotesFiltradosMaximo = pacotesFiltradosMinimo.filter((produto) =>{
      if(this.state.filtroMaximo){
        return produto.price <= this.state.filtroMaximo
      }else{
        return produto
      }
    })

   

    const pacoteFiltrado = pacotesFiltradosMaximo.filter((produto) =>{
      return produto.name.includes(this.state.filtroBuscaPorNome)
    })
    
    return pacoteFiltrado
  }

  ordenarProdutos = (e) => {
    this.setState({ordenacao: e.target.value})
  }

  adicionarProdutoNoCarrinho = (produto) => {
    const produtoNoCarrinho = this.state.carrinho.filter(item =>{
      if(item.id === produto.id){
        return item
      }
    })
    
    if(produtoNoCarrinho.length === 0){
      produto.quantidade = 1
      const novoCarrinho = [produto, ...this.state.carrinho]
      this.setState({
        carrinho: novoCarrinho
      })
    }else{
      const novoCarrinho = this.state.carrinho.map(item => {
        if(produto.id === item.id && item.quantidade >= 1){
          return {...item, quantidade: item.quantidade + 1}
        }else{
          return item
        }
      })
      this.setState({
        carrinho: novoCarrinho
      })
    }
    this.adicionarValorTotal(produto.price)
  }

  removerItemDoCarrinho = (itemParaRemover) => {
    if(itemParaRemover.quantidade === 1){
      const novoCarrinho = this.state.carrinho.filter(item=>{
        if(item.id !== itemParaRemover.id){
          return item
        }
      })
      this.setState({
        carrinho: novoCarrinho
      })
    }else{
      const novoCarrinho = this.state.carrinho.map(item => {
        if(itemParaRemover.id === item.id && item.quantidade >= 1){
          return {...item, quantidade: item.quantidade - 1}
        }else{
          return item
        }
      })
      this.setState({
        carrinho: novoCarrinho
      })
    }
    this.subtrairValorTotal(itemParaRemover.price)
  }

  adicionarValorTotal = (valor) => {
    this.setState({
      valorTotal: this.state.valorTotal + valor
    })
  }

  subtrairValorTotal = (valor) => {
    this.setState({
      valorTotal: this.state.valorTotal - valor
    })
  }
  
  render(){

    const produtosFiltrados = this.filtrarProdutos()
   
    return <ConjuntoDeComponentes>
      <Filtros
        minimo={this.state.filtroMinimo}
        maximo={this.state.filtroMaximo}
        buscaPorNome={this.state.filtroBuscaPorNome}

        onChangeMinimo = {this.manipularValorDoFiltroMinimo}
        onChangeMaximo = {this.manipularValorDoFiltroMaximo}
        onChangeBuscaPorNome = {this.manipularValorDoFiltroBuscaPorNome}
      />

      <Produtos
        quantidade= {produtosFiltrados.length}
        ordenacao= {this.state.ordenacao}
        onChangeCabecalho= {this.ordenarProdutos}
        produtos = {produtosFiltrados}
        onClick = {this.adicionarProdutoNoCarrinho}
      />

      <Carrinho
        carrinho={this.state.carrinho}
        valorTotal={this.state.valorTotal}
        removerItemDoCarrinho={this.removerItemDoCarrinho}
      />
    </ConjuntoDeComponentes>
  }
}

export default App;
