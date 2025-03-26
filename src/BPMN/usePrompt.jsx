import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const usePrompt = (message, when) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!when) return;

        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = message;
        };

        const handleNavigation = (event) => {
            if (window.confirm(message)) {
                navigate(event.detail.location.pathname);
            } else {
                event.preventDefault();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handleNavigation);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handleNavigation);
        };
    }, [message, when, navigate, location]);
};

export default usePrompt;