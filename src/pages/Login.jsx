import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { ThreeDots } from "react-loader-spinner";
import UserContext from "../AuthContext";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    axios
      .post(
        "https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/auth/login",
        form
      )
      .then((response) => {
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/habitos");
      })
      .catch(() => {
        setError("Email ou senha incorretos.");
        alert("Email ou senha incorretos.");
        setLoading(false);
      });
  }

  return (
    <Container>
      <LoginBox>
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
          <Button type="submit" disabled={loading}>
            {loading ? <ThreeDots color="#fff" height={13} /> : "Entrar"}
          </Button>
        </form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <SignupLink to="/cadastro">Não tem uma conta? Cadastre-se!</SignupLink>
      </LoginBox>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Lexend Deca", sans-serif;
`;

const LoginBox = styled.div`
  display: flex;
  width: 320px;
  background: white;
  padding: 30px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
