import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import Logo from '../../assets/logo.svg';
import { Button } from '../../components/Button';
import { api } from '../../services/api';
import * as S from './styles';

export const Login = () => {
  const schema = yup
    .object({
      email: yup
        .string()
        .email('Digite um email válido')
        .required('O email é obrigatório'),
      password: yup
        .string()
        .min(6, 'A senha deve ter pelo menos 6 caracteres')
        .required('Digite uma senha'),
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
    const response = await toast.promise(
      api.post('/session', {
        email: data.email,
        password: data.password,
      }),
      {
        pending: 'Verificando seus dados',
        success: 'Seja Bem-vindo(a)!',
        error: 'Email ou Senha Incorretos',
      },
    );

    console.log(response);
  };

  return (
    <S.Container>
      <S.LeftContainer>
        <img src={Logo} alt="logo devburger" />
      </S.LeftContainer>
      <S.RightContainer>
        <S.Title>
          Olá, seja bem vindo ao <span>Dev Burger!</span> <br /> Acesse com seu{' '}
          <span>Login e senha.</span>
        </S.Title>
        <S.Form onSubmit={handleSubmit(onSubmit)}>
          <S.InputContainer>
            <label>Email</label>
            <input type="email" {...register('email')} />
            <p>{errors?.email?.message}</p>
          </S.InputContainer>
          <S.InputContainer>
            <label>Senha</label>
            <input type="password" {...register('password')} />
            <p>{errors?.password?.message}</p>
          </S.InputContainer>
          <Button type="submit">Entrar</Button>
        </S.Form>
        <S.Text>
          Não possui conta? <a href=""> Clique aqui.</a>
        </S.Text>
      </S.RightContainer>
    </S.Container>
  );
};
