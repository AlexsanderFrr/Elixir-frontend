import React, { useState, useEffect } from "react";
import axios from "axios";
import { LiaFileUploadSolid } from "react-icons/lia";


const CadastroSuco = () => {
  const [suco, setSuco] = useState({
    nome: "",
    ingredientes: "",
    modo_de_preparo: "",
    beneficios: "",
    img1: null,
    diagnostico: "", // Usar uma string para um único diagnóstico
  });

  const [diagnosticosList, setDiagnosticosList] = useState([]);

  useEffect(() => {
    // Buscar a lista de diagnósticos quando o componente montar
    const fetchData = async () => {
      const diagnosticosResponse = await axios.get(
        "http://localhost:8081/diagnostico/all"
      );
      setDiagnosticosList(diagnosticosResponse.data);
    };

    fetchData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setSuco({ ...suco, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSuco({ ...suco, img1: file });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("nome", suco.nome);
    formData.append("ingredientes", suco.ingredientes);
    formData.append("modo_de_preparo", suco.modo_de_preparo);
    formData.append("beneficios", suco.beneficios);
    if (suco.img1) {
      formData.append("img1", suco.img1, suco.img1.name);
    }
    formData.append("diagnostico", suco.diagnostico); 

    try {
      await axios.post("http://localhost:8081/suco/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Suco cadastrado com sucesso!");
    } catch (error) {
      console.error(
        "Erro ao cadastrar o Suco:",
        error.message,
        error.response?.data
      );
    }
  };

  return (
    <div className="cadastro-suco-container">
      <h1>Cadastro de Suco</h1>
      <form onSubmit={handleSubmit} className="cadastro-suco-form">
        <label>
          Nome:
          <input
            type="text"
            name="nome"
            value={suco.nome}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />
        <label>
          Ingredientes:
          <textarea
            name="ingredientes"
            value={suco.ingredientes}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />
        <label>
          Modo de Preparo:
          <textarea
            name="modo_de_preparo"
            value={suco.modo_de_preparo}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />
        <label>
          Benefícios:
          <textarea
            name="beneficios"
            value={suco.beneficios}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />

        <label>
          Diagnóstico:
          <select
            name="diagnostico"
            value={suco.diagnostico}
            onChange={handleInputChange}
          >
            <option value="">Selecione um diagnóstico</option>
            {diagnosticosList.map((diagnostico) => (
              <option key={diagnostico.id} value={diagnostico.id}>
                {diagnostico.nome_da_condicao}
              </option>
            ))}
          </select>
        </label>
        <br />
        <br />
        <div className="upload-container">
          <LiaFileUploadSolid />
          <input type="file" name="img1" onChange={handleFileChange} />
        </div>
        {suco.img1 && (
          <div className="image-preview">
            <img
              src={URL.createObjectURL(suco.img1)}
              alt="Preview da Imagem"
              style={{ maxWidth: "100px" }}
            />
          </div>
        )}
        <br />
        <br />
        <button type="submit" className="button">
          Cadastrar Suco
        </button>
      </form>
    </div>
  );
};

export default CadastroSuco;
