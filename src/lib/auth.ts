interface Session {
    user: {
        name: string;
        role: string;
    };
}

const MOCK_SESSION: Session = {
    user: {
        name: '管理员',
        role: 'editor',
    },
};

export async function getSession(): Promise<Session | null> {
    return import.meta.env.DEV ? MOCK_SESSION : null;
}
