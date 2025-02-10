import { useState, useContext, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { ThreeDots } from "react-loader-spinner";
import UserContext from "../AuthContext";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

export default function Habits() {
  const { user } = useContext(UserContext);
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("habits");
  const today = dayjs().locale("pt-br").format("dddd, DD/MM");

  useEffect(() => {
    if (selectedTab === "habits" && user) {
      axios
        .get(
          "https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits",
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
        .then((res) => setHabits(res.data))
        .catch((err) => console.error(err));
    }
  }, [user, selectedTab]);

  useEffect(() => {
    if (selectedTab === "today" && user) {
      axios
        .get(
          "https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/today",
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
        .then((res) => setHabits(res.data))
        .catch((err) => console.error(err));
    }
  }, [user, selectedTab]);

  function toggleDay(day) {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  }

  function handleSave() {
    if (!habitName || selectedDays.length === 0) {
      alert("Preencha o nome do hábito e selecione pelo menos um dia!");
      return;
    }
    setLoading(true);
    const newHabit = { name: habitName, days: selectedDays };

    axios
      .post(
        "https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits",
        newHabit,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then(() => {
        setHabits([...habits, newHabit]);
        setShowForm(false);
        setHabitName("");
        setSelectedDays([]);
      })
      .catch((err) => {
        alert("Erro ao salvar hábito!");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }

  return (
    <Container>
      <Header>
        <h1>TrackIt</h1>
        <UserImage src={user?.image} alt="Foto do usuário" />
      </Header>

      <Content>
        {selectedTab === "today" ? (
          <DateTitle>{today}</DateTitle>
        ) : (
          <Title>
            <h2>Meus hábitos</h2>
            <AddButton onClick={() => setShowForm(true)}>+</AddButton>
          </Title>
        )}

        {showForm && selectedTab === "habits" && (
          <HabitForm>
            <StyledInput
              type="text"
              placeholder="nome do hábito"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              disabled={loading}
            />
            <DaysContainer>
              {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
                <DayButton
                  key={index}
                  selected={selectedDays.includes(index)}
                  onClick={() => toggleDay(index)}
                  disabled={loading}
                >
                  {day}
                </DayButton>
              ))}
            </DaysContainer>
            <Buttons>
              <CancelButton onClick={() => setShowForm(false)}>
                Cancelar
              </CancelButton>
              <SaveButton onClick={handleSave} disabled={loading}>
                {loading ? <ThreeDots color="#FFF" height={13} /> : "Salvar"}
              </SaveButton>
            </Buttons>
          </HabitForm>
        )}

        {habits.length === 0 ? (
          <NoHabits>
            {selectedTab === "habits"
              ? "Você não tem nenhum hábito cadastrado ainda. Adicione um hábito para começar a trackear!"
              : "Você não tem nenhum hábito para hoje!"}
          </NoHabits>
        ) : (
          <HabitList>
            {habits.map((habit) => (
              <HabitItem key={habit.id} done={habit.done}>
                <h3>{habit.name}</h3>
                {selectedTab === "today" && (
                  <>
                    <p>Sequência atual: {habit.currentSequence} dias</p>
                    <p>Seu recorde: {habit.highestSequence} dias</p>
                  </>
                )}
                <DaysContainer>
                  {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
                    <DayButton
                      key={index}
                      selected={habit.days?.includes(index)}
                      disabled
                    >
                      {day}
                    </DayButton>
                  ))}
                </DaysContainer>
              </HabitItem>
            ))}
          </HabitList>
        )}
      </Content>

      <Menu>
        <MenuItem
          selected={selectedTab === "habits"}
          onClick={() => setSelectedTab("habits")}
        >
          <CalendarMonthIcon className="icon" />
          Hábitos
        </MenuItem>
        <MenuItem
          selected={selectedTab === "today"}
          onClick={() => setSelectedTab("today")}
        >
          <EventAvailableIcon className="icon" />
          Hoje
        </MenuItem>
      </Menu>
    </Container>
  );
}

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #d4d4d4;
  font-family: lexend deca;
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: 10px;
  box-sizing: border-box;
  color: #666666;
  &::placeholder {
    color: #dbdbdb;
  }
`;
const Container = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  background: #f2f2f2;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const Header = styled.header`
  position: fixed;

  width: 100%;
  font-family: playball;
  height: 70px;
  background: #126ba5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  top: 0;
  left: 0;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3);

  H1 {
    font-weight: 300;
  }
`;

const UserImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const Content = styled.div`
  margin-top: 80px;
  width: 100%;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #126ba5;
  font-family: "Lexend Deca", sans-serif;
  margin-bottom: 20px;
`;

const DateTitle = styled.h2`
  color: #126ba5;
  font-family: "Lexend Deca", sans-serif;
  font-size: 22px;
  text-transform: capitalize;
  margin-bottom: 20px;
`;

const AddButton = styled.button`
  width: 40px;
  height: 40px;
  font-size: 22px;
  color: white;
  background: #52b6ff;
  border: none;
  border-radius: 10%;
  cursor: pointer;
`;

const NoHabits = styled.p`
  margin-top: 20px;
  font-family: lexend deca;
  color: #666666;
  text-align: center;
`;

const HabitForm = styled.div`
  background: white;
  padding: 15px;
  border-radius: 5px;
  margin: 15px 0;
`;

const DaysContainer = styled.div`
  display: flex;
  gap: 5px;
`;

const DayButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background: ${({ selected }) => (selected ? "#d4d4d4" : "#fff")};
  color: ${({ selected }) => (selected ? "#fff" : "#D4D4D4")};
  border: 1px solid #d4d4d4;
  cursor: pointer;
  font-size: 14px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
`;

const CancelButton = styled.button`
  background: transparent;
  color: #52b6ff;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;

const SaveButton = styled.button`
  background: #52b6ff;
  color: white;
  border: none;
  font-size: 16px;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
`;

const HabitList = styled.div`
  margin-top: 20px;
  color: #666666;
  padding: 10px;
`;

const HabitItem = styled.div`
  background: white;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;

  h3 {
    font-weight: 400;
    color: #666666;
    border: 1px solid #d4d4d4;
    border-radius: 3px;
    padding: 5px;
  }

  p {
    font-size: 14px;
    color: #666;
  }
`;

const Menu = styled.footer`
  position: fixed;
  bottom: 0;
  width: 100%;
  background: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
`;

const MenuItem = styled.button`
  border: none;
  background: ${({ selected }) => (selected ? "#52b6ff" : "transparent")};
  color: ${({ selected }) => (selected ? "white" : "#52b6ff")};
  padding: 8px 50px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: ${({ selected }) =>
      selected ? "#3a93d6" : "rgba(82, 182, 255, 0.2)"};
  }
`;
