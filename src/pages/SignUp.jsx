import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { ThreeDots } from "react-loader-spinner";
import logo from "../assets/logo.png";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    axios
      .post(
        "https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/auth/sign-up",
        form
      )
      .then((res) => {
        console.log("Cadastro realizado com sucesso!", res.data);
        navigate("/habitos");
      })
      .catch((err) => {
        console.error(
          "Erro ao cadastrar:",
          err.response?.data?.message || err.message
        );
        alert(
          err.response?.data?.message ||
            "Erro ao cadastrar. Verifique os dados."
        );
        setError(err.response?.data?.message || "Erro ao cadastrar.");
        setLoading(false);
      });
  }

  return (
    <Container>
      <Logo src={logo} alt="TrackIt Logo" />
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          placeholder="email"
          value={form.email}
          onChange={handleChange}
          disabled={loading}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="senha"
          value={form.password}
          onChange={handleChange}
          disabled={loading}
          required
        />
        <Input
          type="text"
          name="name"
          placeholder="nome"
          value={form.name}
          onChange={handleChange}
          disabled={loading}
          required
        />
        <Input
          type="url"
          name="image"
          placeholder="foto"
          value={form.image}
          onChange={handleChange}
          disabled={loading}
          required
        />

        <Button type="submit" disabled={loading}>
          {loading ? <ThreeDots color="#fff" height={13} /> : "Cadastrar"}
        </Button>
      </form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <SignupLink to="/">Já tem uma conta? Faça login!</SignupLink>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Lexend Deca", sans-serif;
`;

const Logo = styled.img`
  width: 180px;
  margin-bottom: 50px;
`;

const Input = styled.input`
  display: block;
  width: 303px;
  padding: 8px;
  font-family: "Lexend Deca", sans-serif;
  margin-bottom: 5px;
  border: 1px solid #d4d4d4;
  border-radius: 5px;
  font-size: 16px;
  &::placeholder {
    color: #dbdbdb;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #52b6ff;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  font-family: "Lexend Deca", sans-serif;
  &:disabled {
    background-color: #b0cce1;
    cursor: not-allowed;
  }
`;

const SignupLink = styled(Link)`
  font-size: 13px;
  padding: 10px;
  color: #52b6ff;
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;
