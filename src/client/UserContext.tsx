import { createContext } from 'react'

export const UserContext = createContext<UserContextInterface | null>(null);

export const HonContext = createContext<number | null>(null);

export const YoutubeContext = createContext<number | null>(null);
