import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/auth.hook';
import { getUser, isUserEmployer, login } from '../services/auth.service';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const navigate = useNavigate();
  const [failed, setFailed] = useState('');
  const { user, setUser, setIsEmployer } = useAuth();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, []);

  const onSubmit = async (data: any) => {
    const result = await login(data.email, data.password);

    const tryLogin = getUser();

    /* @ts-ignore */
    if (result && !result.success) {
      /* @ts-ignore */
      setFailed(result.message);
      return;
    }

    setUser(tryLogin);

    let next = searchParams.get('next');

    if (searchParams.get('next')) {
      if (next?.charCodeAt(0) === 47) {
        next = next.slice(1);
      }

      navigate(`/${next}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="container-fluid form-signin d-flex justify-content-center align-items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="text-center flex-fill">
        <h1 className="h3 mb-3 fw-normal">Welcome back!</h1>

        <div className="form-floating">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            autoComplete="off"
            {...register('email', {
              required: true,
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            })}
          />
          {errors.email && <p className="text-danger">Please enter your email</p>}
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            autoComplete="off"
            {...register('password', { required: true, pattern: /^(?=.*\d)(?=.*[a-z]).{8,16}$/ })}
          />
          {errors.password && <p className="text-danger">Please enter your password</p>}
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <div className="checkbox mb-3">
          <label>
            <input type="checkbox" value="remember-me" /> Remember me
          </label>
        </div>
        <button className="w-100 btn btn-lg btn-primary" type="submit">
          Sign in
        </button>
        {failed && <p className="text-danger">{failed}</p>}
        {searchParams.get('dangerMessage') && (
          <p className="text-danger">{decodeURIComponent(searchParams.get('dangerMessage')!)}</p>
        )}
        {searchParams.get('successMessage') && (
          <p className="text-success">{decodeURIComponent(searchParams.get('successMessage')!)}</p>
        )}
        <p className="mt-5 mb-3 text-muted">&copy; 2022</p>
      </form>
    </div>
  );
}
