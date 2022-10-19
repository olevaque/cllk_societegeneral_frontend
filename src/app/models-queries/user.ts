
import gql from "graphql-tag";

export interface Users
{
    users: User[];
}

export interface Role
{
    name: string;
}

export interface User
{
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    role: Role;
}

export const FIND_USERS = gql`
query Users
{
    users
    {
        id
        username
        firstname
        lastname
        email
        role
        {
            name
        }
    }
}`;

export const CREATE_USER = gql`
mutation CreateUser($username: String!, $firstname: String!, $lastname: String!, $email: String!, $password: String!)
{
    createUser(input: {data: {
        username: $username
        firstname: $firstname
        lastname: $lastname
        email: $email
        password: $password
        confirmed: true
        blocked: false
    }})
    {
        user
        {
            id
            username
            firstname
            lastname
            email
        }
    }
}`;

export const DELETE_USER = gql`
mutation DeteleteUser($userId: ID!)
{
    deleteUser(input: { where: {
        id: $userId
    }})
    {
        user
        {
            id
        }
    }
}`;

export const UPDATE_USER_ROLE = gql`
mutation UpdateUser($userId: ID!)
{
    updateUser(input: { where: { id: $userId }, data: { role: 1 }})
    {
        user
        {
            id
        }
    }
}`;