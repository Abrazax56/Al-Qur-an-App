import Input from '.././Elements/Input.tsx';
import Button from '.././Elements/Button.tsx';
import Label from '.././Elements/Label.tsx';
import Loading from '.././Elements/Loading.tsx';
import { validate } from '../.././service/Validation/EventChange.ts';
import { submitValidate } from '../.././service/Validation/EventSubmit.ts';
import { login } from '../.././service/Auth/Login.ts';
import { register } from '../.././service/Auth/Register.ts';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ZodError } from 'zod';

export default ({type}: {type?: string}) => {
    const navigate = useNavigate();
    
    const getCookieValue = (name: string) => (
        document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
    );
    
    useEffect(() => {
        const authToken: string | null = getCookieValue("authToken");
        if(authToken) {
            navigate('/surah');
        }
    }, []);
    
    const [username, setUsername] = useState<string>("Masukan nama pengguna");
    const [password, setPassword] = useState<string>("Masukan kata sandi");
    const [btnhidden, setBtnHidden] = useState<boolean>(false);
    const [loadingBtn, setLoadingBtn] = useState<boolean>(true);
    const [message, setMessage] = useState<string>("");
    
    const usernameChange = (e: ChangeEvent<HTMLInputElement>): void => validate(e, "username", (msg: string): void => setUsername(msg));
    const passwordChange = (e: ChangeEvent<HTMLInputElement>): void => validate(e, "password", (msg: string): void => setPassword(msg));
    
    const HandleSubmit = (e: FormEvent<HTMLInputElement | HTMLFormElement>): void => {
        e.preventDefault();
        const isValidate = submitValidate(e, type);
        if(isValidate) {
            if(type === "daftar") {
                setBtnHidden(true);
                setLoadingBtn(false);
                register(e, (status: number, msg: string) => {
                    setBtnHidden(false);
                    setLoadingBtn(true);
                    setMessage(msg);
                    if(status === 200) navigate('/masuk');
                });
            } else {
                setBtnHidden(true);
                setLoadingBtn(false);
                login(e, (status: number, msg: string) => {
                    setBtnHidden(false);
                    setLoadingBtn(true);
                    setMessage(msg);
                    if(status === 200) navigate('/surah');
                });
            }
        }
    }
    
    return (
        <form className="auth-box" onSubmit={HandleSubmit}>
            <h1 className="title mb-5">القرآن الكريم</h1>
            {
                message && <p className="message">{message}</p>
            }
            <NameInput type={type}/>
            <div className="input-group">
                <Input 
                text="name"
                identify="username"
                onChanges={usernameChange}
                />
                <Label
                inputFor="username"
                >{username}</Label>
            </div>
            <div className="input-group">
                <Input
                text="name"
                type="password"
                identify="password"
                onChanges={passwordChange}
                />
                <Label
                inputFor="password"
                >{password}</Label>
            </div>
            <div className="px-5 w-full">
                <Button type="submit" isHidden={btnhidden}>
                    {
                        type === "daftar" ? "Daftar" : "Masuk"
                    }
                </Button>
                <Button type="button" isHidden={loadingBtn}>
                    <Loading/>
                    Memproses...
                </Button>
            </div>
            <Footer type={type}/>
        </form>
    )
}

function NameInput({type}: {type?: string}) {
    if(type === "daftar") {
        const [name, setName] = useState<string>("Masukan nama lengkap");
        const nameChange = (e: ChangeEvent<HTMLInputElement>): void => validate(e, "name", (msg: string): void => setName(msg));
        return (
            <div className="input-group">
                <Input 
                text="name"
                identify="fullname"
                onChanges={nameChange}
                />
                <Label
                inputFor="fullname"
                >{name}</Label>
            </div>
        )
    } else {
        return <></>
    }
}

function Footer({type}: {type?: string}) {
    if(type === "daftar") {
        return (
            <p className="foot-auth">Sudah punya akun? <Link className="navigate-auth" to="/masuk">Masuk</Link></p>
        )
    } else {
        return (
            <p className="foot-auth">Belum punya akun? <Link className="navigate-auth" to="/daftar">Daftar</Link></p>
        )
    }
}