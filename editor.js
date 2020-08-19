class Editor{
    constructor(altura, largura, tipos){
        this.altura = altura;
        this.largura = largura;
        this.tipos = tipos;
        this.tiposBlocos = ["Nada"]
        for (let i = 0; i < tipos.length; i++) {
            this.tiposBlocos.push(tipos[i].nome);
        }
        this.win;
        this.blocoSelecionado = 0;
    }
    gerarEditor(editorNome){
        console.log("============EDITOR SENDO GERADO============");
        let horaInicio = new Date();
        this.matrizMapa = new Array(this.altura);
        this.matrizMapaElementos = new Array(this.altura);
        let showMatriz = "";
        for (let i = 0; i < this.matrizMapa.length; i++) {
            this.matrizMapa[i] = new Array(this.largura);
            this.matrizMapaElementos[i] = new Array(this.largura);
            for (let j = 0; j < this.largura; j++) {
                this.matrizMapa[i][j] = 0;
            }
            showMatriz += this.matrizMapa[i].toString().replace(new RegExp(",", "g"), " ") + "\n";
        }
        console.log(showMatriz);
        console.log(`Tamanho: ${this.largura}x${this.altura}`);
        
        this.editorElemento = document.createElement("div");
        this.editorElemento.id = "editor";
        this.editorElemento.style.width = `${this.largura * 30 + 200}px`;
        this.editorElemento.style.height = `${this.altura * 30}px`;

        this.mapaElemento = document.createElement("div");
        this.mapaElemento.id = "mapa";
        this.mapaElemento.style.width = `${this.largura * 30}px`;
        this.mapaElemento.style.height = `${this.altura * 30}px`;
        this.mapaElemento.style.backgroundColor = "white";
        this.mapaElemento.style.display = "flex";
        this.mapaElemento.style.flexWrap = "wrap";

        let comecaPreto = false;
        for (let i = 0; i < this.matrizMapa.length; i++) {
            let ePreto = false;
            for (let j = 0; j < this.largura; j++) {
                let elemento = document.createElement("div");
                elemento.style.width = "30px";
                elemento.style.height = "30px";
                elemento.style.cursor = "pointer";
                elemento.setAttribute("onclick", `${editorNome}.mudarTipo(${i},${j})`);
                let corVazio;
                if(comecaPreto && j == 0){
                    corVazio = "rgba(0,0,0,0.4)";
                    ePreto = false;
                }else if(ePreto){
                    corVazio = "rgba(0,0,0,0.4)";
                    ePreto = !ePreto;
                }else{
                    corVazio = "rgba(0,0,0,0.2)";
                    ePreto = !ePreto;
                }
                this.matrizMapaElementos[i][j] = new Bloco(i, j, corVazio, elemento);
                this.mapaElemento.appendChild(this.matrizMapaElementos[i][j].elemento);
            }
            comecaPreto = !comecaPreto;
        }

        this.funcoesElemento = document.createElement("div");
        this.funcoesElemento.id = "funcoes";
        this.funcoesElemento.style.display = "flex";
        this.funcoesElemento.style.alignItems = "center";
        this.funcoesElemento.style.justifyContent = "flex-start";
        this.funcoesElemento.style.flexDirection = "column";
        this.funcoesElemento.style.width = `200px`;
        this.funcoesElemento.style.minHeight = "300px";
        this.funcoesElemento.style.height = `${this.altura * 30}px`;
        this.funcoesElemento.style.backgroundColor = "blue";

        let selectTag = document.createElement("select");
        for (let i = 0; i < this.tiposBlocos.length; i++) {
            let optionTag = document.createElement("option");
            optionTag.innerHTML = this.tiposBlocos[i];
            optionTag.setAttribute("value", i);
            selectTag.appendChild(optionTag);
        }
        selectTag.setAttribute("onchange", `${editorNome}.blocoSelecionado = value;`);
        selectTag.style.marginTop = "10px";
        selectTag.style.width = "180px";
        selectTag.style.height = "40px";
        selectTag.style.fontSize = "20px";
        this.funcoesElemento.appendChild(selectTag);

        let btnTag = document.createElement("button");
        btnTag.innerHTML = "Gerar Imagem";
        btnTag.setAttribute("onclick", `${editorNome}.gerarImg();`);
        btnTag.style.marginTop = "10px";
        btnTag.style.width = "180px";
        btnTag.style.height = "40px";
        btnTag.style.fontSize = "20px";
        this.funcoesElemento.appendChild(btnTag);

        this.editorElemento.appendChild(this.mapaElemento);
        this.editorElemento.appendChild(this.funcoesElemento);
        this.editorElemento.style.display = "flex";
        
        document.body.appendChild(this.editorElemento);

        this.tempoCriacao = (new Date().getSeconds()) - horaInicio.getSeconds();
        console.log(`Tempo de criação: ${this.tempoCriacao}s`);
        console.log("=========EDITOR GERADO COM SUCESSO=========");
    }
    mudarTipo(y, x) {
        if(this.blocoSelecionado == 0){
            this.matrizMapa[y][x] = 0;
            this.matrizMapaElementos[y][x].elemento.style.background = this.matrizMapaElementos[y][x].corVazio;
            this.matrizMapaElementos[y][x].elemento.style.border = "none";
            this.adicionarBorda(y, x);
        }else{
            this.matrizMapa[y][x] = this.blocoSelecionado;
            this.matrizMapaElementos[y][x].elemento.style.background = this.tipos[this.blocoSelecionado - 1].cor;
            this.matrizMapaElementos[y][x].elemento.style.border = "4px solid black";
            this.removerBorda(y, x);
        }
    }
    removerBorda(y, x){
        if((y+1) <= (this.matrizMapa.length - 1)){
            if(this.matrizMapa[y+1][x] != 0){
                this.matrizMapaElementos[y+1][x].elemento.style.borderTop = "none";
                this.matrizMapaElementos[y][x].elemento.style.borderBottom = "none";
            }
        }
        if((y-1) >= 0){
            if(this.matrizMapa[y-1][x] != 0){
                this.matrizMapaElementos[y-1][x].elemento.style.borderBottom = "none";
                this.matrizMapaElementos[y][x].elemento.style.borderTop = "none";
            }
        }
        if((x+1) <= (this.matrizMapa[0].length - 1)){
            if(this.matrizMapa[y][x+1] != 0){
                this.matrizMapaElementos[y][x+1].elemento.style.borderLeft = "none";
                this.matrizMapaElementos[y][x].elemento.style.borderRight = "none";
            }
        }
        if((x-1) >= 0){
            if(this.matrizMapa[y][x-1] != 0){
                this.matrizMapaElementos[y][x-1].elemento.style.borderRight = "none";
                this.matrizMapaElementos[y][x].elemento.style.borderLeft = "none";
            }
        }
    }
    adicionarBorda(y, x){
        if((y+1) <= (this.matrizMapa.length - 1)){
            if(this.matrizMapa[y+1][x] != 0){
                this.matrizMapaElementos[y+1][x].elemento.style.borderTop = "4px solid black";
            }
        }
        if((y-1) >= 0){
            if(this.matrizMapa[y-1][x] != 0){
                this.matrizMapaElementos[y-1][x].elemento.style.borderBottom = "4px solid black";
            }
        }
        if((x+1) <= (this.matrizMapa[0].length - 1)){
            if(this.matrizMapa[y][x+1] != 0){
                this.matrizMapaElementos[y][x+1].elemento.style.borderLeft = "4px solid black";
            }
        }
        if((x-1) >= 0){
            if(this.matrizMapa[y][x-1] != 0){
                this.matrizMapaElementos[y][x-1].elemento.style.borderRight = "4px solid black";
            }
        }
    }
    gerarImg(){
        var canvas = document.createElement("canvas");
        canvas.height = this.altura * 30;
        canvas.width = this.largura * 30;
        var canvasContext = canvas.getContext("2d");
        if(this.win != null){
            this.win.close();
        }
        for (let i = 0; i < this.altura; i++) {
            for (let j = 0; j < this.largura; j++) {
                if(this.matrizMapa[i][j] != 0){
                    canvasContext.fillStyle = this.tipos[this.matrizMapa[i][j] - 1].cor;
                    canvasContext.fillRect((j * 30), (i * 30), 30, 30);
                }
            }
        }
        this.win = window.open("","Resultado (IMG)", `height=${this.altura * 30 + 6},width=${this.largura * 30 + 12}`);
        this.win.document.write(`<img src=${canvas.toDataURL()}>`);
        this.win.document.body.style.background = "#D9DEED";
    }
}
class Bloco{
    constructor(y, x, corVazio, elemento){
        this.y = y;
        this.x = x;
        this.corVazio = corVazio;
        this.elemento = elemento;
        elemento.style.background = this.corVazio;
        elemento.style.boxSizing = "border-box";
    }
}
class Tipo{
    constructor(nome, cor){
        this.nome = nome;
        this.cor = cor;
    }
}