import { Children, createContext, useContext, useState } from "react";

interface IAppContext {
    isAuthenticated: boolean;
    user: IUser | null;
    setIsAuthenticated: (v: boolean) => void;
    setUser: (v: IUser | null) => void;
    isAppLoading: boolean;
    setIsAppLoadding: (v: boolean) => void;
}

const CurrentAppContext = createContext<IAppContext | null>(null);
type TProps = {
    children: React.ReactNode;
}
export const AppProvider = (props: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isAppLoading, setIsAppLoadding] = useState<boolean>(true);
    const [user, setUser] = useState<IUser | null>(null);


    return (
        <CurrentAppContext.Provider value={{
            isAuthenticated,
            user,
            setIsAuthenticated,
            setUser,
            isAppLoading, setIsAppLoadding
        }}>
            {props.children}
        </CurrentAppContext.Provider>
    );
};

export const useCurrentApp = () => {
    const currentUserContext = useContext(CurrentAppContext);

    if (!currentUserContext) {
        throw new Error(
            "useCurrentApp has to be used within <CurrentAppContext.Provider>"
        );
    }

    return currentUserContext;
};
