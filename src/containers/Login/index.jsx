/* eslint-disable prettier/prettier */
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";

import Logo from "../../assets/logo.svg";
import { Button } from "../../components/Button";
import { api } from "../../services/api";
import * as S from "./styles";

export const Login = () => {
	const navigate = useNavigate();
	const schema = yup
		.object({
			email: yup
				.string()
				.email("Digite um email válido")
				.required("O email é obrigatório"),
			password: yup
				.string()
				.min(6, "A senha deve ter pelo menos 6 caracteres")
				.required("Digite uma senha"),
		})
		.required();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const onSubmit = async (data) => {
		try {
			const response = await api.post(
				"/session",
				{
					email: data.email,
					password: data.password,
				},
				{
					validateStatus: () => true,
				},
			);

			if (response.status === 200 || response.status === 201) {
				setTimeout(() => {
					navigate("/");
				}, 1500);
				toast.success("Seja Bem-vindo(a)");
			} else if (
				response.data.error === "Make sure your email or password are correct"
			) {
				toast.error("Email ou Senha Incorretos");
			} else {
				throw new Error();
			}
		} catch (error) {
			toast.error("Ops! Algo deu errado, tente novamente!");
		}
	};

	return (
		<S.Container>
			<S.LeftContainer>
				<img src={Logo} alt="logo devburger" />
			</S.LeftContainer>
			<S.RightContainer>
				<S.Title>
					Olá, seja bem vindo ao <span>Dev Burger!</span> <br /> Acesse com seu{" "}
					<span>Login e senha.</span>
				</S.Title>
				<S.Form onSubmit={handleSubmit(onSubmit)}>
					<S.InputContainer>
						<label>Email</label>
						<input type="email" {...register("email")} />
						<p>{errors?.email?.message}</p>
					</S.InputContainer>
					<S.InputContainer>
						<label>Senha</label>
						<input type="password" {...register("password")} />
						<p>{errors?.password?.message}</p>
					</S.InputContainer>
					<Button type="submit">Entrar</Button>
				</S.Form>
				<S.Text>
					Não possui conta? <S.Link to="/cadastro"> Clique aqui.</S.Link>
				</S.Text>
			</S.RightContainer>
		</S.Container>
	);
};
