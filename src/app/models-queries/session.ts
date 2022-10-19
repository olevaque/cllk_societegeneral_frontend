
import gql from "graphql-tag";
import { Rate } from "./rate";
import { User } from "./user";

export interface Sessions
{
    sessions: Session[];
}

export interface Session
{
    id: number;
    uuid: string;
    name: string;
    animator: User;
    rates: Rate[];

    isSessionStarted: boolean;
    isGameStarted: boolean;
    isGameCompleted: boolean;
    gameStartTime: string;

    score: number;
    timeSpent: string;

    displayedElapsedTime: string;
}

export const FIND_SESSIONS = gql`
query Sessions($filter: JSON!)
{
    sessions(where: $filter,
        sort: "created_at:desc")
    {
        id
        uuid
        name

        rates
        {
            stars
            comment
        }

        isSessionStarted
        isGameStarted
        isGameCompleted
        gameStartTime
        score
        
        animator
        {
            username
        }
    }
}`;

export const CREATE_SESSION = gql`
mutation CreateUniqueSession($name: String!, $isVersionA: Boolean!)
{
    createUniqueSession(name: $name, isVersionA: $isVersionA)
}`;

export const START_SESSION = gql`
mutation StartSession($sessionId: ID!)
{
    updateSession(input: {
        where: { id: $sessionId }, 
        data: { isSessionStarted: true }})
    {
        session
        {
            id
        }
    }
}`;