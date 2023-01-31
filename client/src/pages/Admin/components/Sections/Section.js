import React from "react";
import NewConsumers from "./Subsections/NewConsumers";
import NewEncomendas from "./Subsections/NewEncomendas";
import NewFornecedores from "./Subsections/NewFornecedores";
import StatsConsumer from "./Subsections/StatsConsumer";
import StatsFornecedor from "./Subsections/StatsFornecedor";
import StatsProdutos from "./Subsections/StatsProdutos";
import SupportActivity from "./Subsections/SupportsActivity";
import MessagesActivity from "./Subsections/MessagesActivity";
import TopVendas from "./Subsections/TopVendas";

function Main() {
  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Painel de Controlo</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="index.html">Home</a>
            </li>
            <li className="breadcrumb-item active">Painel de Controlo</li>
          </ol>
        </nav>
      </div>

      <section className="section dashboard">

        <div className="col-lg-12">
          
          <div className="row">
            <SupportActivity></SupportActivity>
            <MessagesActivity></MessagesActivity>
            <StatsConsumer></StatsConsumer>
            <StatsFornecedor></StatsFornecedor>
            <StatsProdutos></StatsProdutos>
            <NewConsumers></NewConsumers>
            <NewFornecedores></NewFornecedores>
            <NewEncomendas></NewEncomendas>
            <TopVendas></TopVendas>
          </div>
        </div>
        
      </section>
    </main>
  );
}

export default Main;
