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

export const Register = () => {
	const navigate = useNavigate();
	const schema = yup
		.object({
			name: yup
				.string()
				.required("O nome é Obrigatório")
				.max(100, "Limite máximo de caracteres excedido."),
			email: yup
				.string()
				.email("Digite um email válido")
				.required("O email é obrigatório"),
			password: yup
				.string()
				.min(6, "A senha deve ter pelo menos 6 caracteres")
				.required("Digite uma senha"),
			confirmPassword: yup
				.string()
				.oneOf([yup.ref("password")], "As senhas devem ser iguais.")
				.required("Confirme sua senha"),
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
				"/users",
				{
					name: data.name,
					email: data.email,
					password: data.password,
				},
				{
					validateStatus: () => true,
				},
			);

			if (response.status === 200 || response.status === 201) {
				setTimeout(() => {
					navigate("/login");
				}, 2000);
				toast.success("Conta criada com sucesso!");
			} else if (response.data.error === "User already exists") {
				toast.error("Email já cadastrado! Faça login para continuar!");
			} else {
				throw new Error();
			}
		} catch (error) {
			toast.error("Falha no sistema! Tente novamente");
		}
	};

	return (
		<S.Container>
			<S.LeftContainer>
				<img src={Logo} alt="logo devburger" />
			</S.LeftContainer>
			<S.RightContainer>
				<S.Title>Criar Conta</S.Title>
				<S.Form onSubmit={handleSubmit(onSubmit)}>
					<S.InputContainer>
						<label>Nome</label>
						<input type="text" {...register("name")} />
						<p>{errors?.name?.message}</p>
					</S.InputContainer>
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
					<S.InputContainer>
						<label>Pode Confirmar sua Senha?</label>
						<input type="password" {...register("confirmPassword")} />
						<p>{errors?.confirmPassword?.message}</p>
					</S.InputContainer>
					<Button type="submit">Criar Conta</Button>
				</S.Form>
				<S.Text>
					Já possui conta? <S.Link to="/login"> Clique aqui.</S.Link>
				</S.Text>
			</S.RightContainer>
		</S.Container>
	);
};
