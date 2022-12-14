import axios, { Axios, AxiosResponse } from 'axios';
import Cookies from 'universal-cookie';
import { UserRoleDto } from '../models/user-role.dto';
import { UserDto } from '../models/user.dto';

const API_URL = `${import.meta.env.VITE_API_URL}`;

export type RegistrationModel = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  employer: boolean;
  role?: number;
};

export interface ILoginResult {
  success: boolean;
  message?: string;
  data?: any;
}

export const login = (email: string, password: string) => {
  return axios
    .post(`${API_URL}/auth/login`, { email, password })
    .then(async (response: AxiosResponse) => {
      const cookies = new Cookies();

      if (response.data.token) {
        cookies.set('token', response.data.token, { path: '/' });
        await getUserByEmail(email).then((user) => {
          localStorage.setItem(
            'user',
            JSON.stringify({ userId: user.userId, name: `${user.firstName} ${user.lastName}` })
          );

          return { success: true, data: getUser() };
        });
      }
    })
    .catch((err: any) => {
      return { success: false, message: err.response.data };
    });
};

export const userWithEmailExists = async (email: string) => {
  return axios.get(`${API_URL}/users/${email}`).then((response: AxiosResponse) => {
    if (response.data.userId) {
      return true;
    }

    return false;
  });
};

export const getUserByEmail = async (email: string) => {
  return await axios.get(`${API_URL}/users/${email}`).then((response: AxiosResponse) => {
    if (response.data.userId) {
      return response.data;
    }

    return undefined;
  });
};

export const getUserById = async (userId: number) => {
  return await axios
    .get(`${API_URL}/users/${userId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
    .then((response: AxiosResponse) => {
      if (response.data.userId) {
        return response.data as UserDto;
      }

      return undefined;
    });
};

export const deleteUser = async (userId: number) => {
  return await axios
    .delete(`${API_URL}/users/${userId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        return true;
      }
    })
    .catch((err) => {
      return false;
    });
};

export const updateUser = async (user: UserDto) => {
  return await axios
    .put(`${API_URL}/users/${user.userId}`, user, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        return true;
      }
    })
    .catch((err) => {
      return false;
    });
};

export const insertUser = async (user: UserDto) => {
  return await axios
    .post(`${API_URL}/users`, user, { headers: { Authorization: `Bearer ${getToken()}` } })
    .then((response: AxiosResponse) => {
      if (response.data) {
        return response.data.userId;
      }
    })
    .catch((err) => {
      return -1;
    });
};

export const getRoleById = async (roleId: number) => {
  return await axios
    .get(`${API_URL}/roles/${roleId}`, { headers: { Authorization: `Bearer ${getToken()}` } })
    .then((response: AxiosResponse) => {
      if (response.data.userRoleId) {
        return response.data as UserRoleDto;
      }

      return undefined;
    });
};

export const insertRole = async (role: UserRoleDto) => {
  return await axios
    .post(`${API_URL}/roles`, role, { headers: { Authorization: `Bearer ${getToken()}` } })
    .then((response: AxiosResponse) => {
      if (response.data) {
        return response.data.userRoleId;
      }
    })
    .catch((err) => {
      return -1;
    });
};

export const updateRole = async (role: UserRoleDto) => {
  return await axios
    .put(`${API_URL}/roles/${role.userRoleId}`, role, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    .then((response: AxiosResponse) => {
      if (response.status === 200) {
        return true;
      }
    })
    .catch((err) => {
      return false;
    });
};

export const getAllUsers = async () => {
  return await axios
    .get(`${API_URL}/users`, { headers: { Authorization: `Bearer ${getToken()}` } })
    .then((response: AxiosResponse) => {
      if (response.data) {
        return response.data;
      }

      return undefined;
    })
    .catch((err) => {
      return undefined;
    });
};

export const getAllUserRoles = async () => {
  return await axios
    .get(`${API_URL}/roles`, { headers: { Authorization: `Bearer ${getToken()}` } })
    .then((response: AxiosResponse) => {
      if (response.data) {
        return response.data;
      }

      return undefined;
    })
    .catch((err) => {
      return undefined;
    });
};

export const getUserRoles = async () => {
  return await axios
    .get(`${API_URL}/roles`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((err: any) => {
      return undefined;
    });
};

export const isUserEmployer = async (roleId: number) => {
  const userRoles = await getUserRoles();

  const employerRole = userRoles.find((role: any) => role.name === 'Employer');

  return roleId === employerRole.userRoleId;
};

export const registerUser = async (model: RegistrationModel) => {
  const userRoles = await getUserRoles();

  let userRole = null;
  if (model.employer) {
    userRole = userRoles.find((role: any) => role.name === 'Employer');
  } else {
    userRole = userRoles.find((role: any) => role.name === 'Candidate');
  }

  model.role = userRole.userRoleId;

  return axios
    .post(`${API_URL}/auth/register`, model)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((err: any) => {
      return undefined;
    });
};

export const verify = (roleLevel?: number) => {
  const token = getToken();

  if (getToken() === null) {
    return 401;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    'X-User-Role-Level': roleLevel || -1
  };

  return axios
    .get(`${API_URL}/auth/verify`, { headers: headers })
    .then((response: any) => {
      return response.status;
    })
    .catch((response: any) => {
      return response.response.status;
    });
};

export const logout = () => {
  const cookies = new Cookies();

  cookies.remove('token');
  localStorage.removeItem('user');
};

export const getToken = () => {
  const cookies = new Cookies();

  const token = cookies.get('token');
  if (token) return token;

  return null;
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  if (user) return JSON.parse(user);

  return null;
};
