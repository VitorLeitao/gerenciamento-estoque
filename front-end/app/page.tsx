// A pagina inicial vai ser de login
"use client";
import Image from 'next/image';
// Redirecionamento de usuario
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast, toast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { z, ZodError } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { getRandomValues } from 'crypto';

const FormLoginSchema = z.object({
  cnpj: z.string().min(1, 'CNPJ is required').max(14, 'CNPJ inválido'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(2, 'Password must have than 2 characters'),
});

const FormCadastroSchema = z.object({
  cnpj: z.string().min(1, 'CNPJ is required').max(14, 'CNPJ inválido'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(5, 'Password must have than 8 characters'),
  senhaRepetida: z.string().min(1, 'senha is required'),
  nome: z.string().min(1, 'nome is required'),
  email: z.string().min(1, 'email is required'),
  ramo: z.string().min(1, 'ramo is required'),
}).refine((data) => data.password === data.senhaRepetida, {
  message: "Passwords don't match",
  path: ["confirm"],
}).refine((data) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email), {
  message: 'Invalid email format',
});

const Home: React.FC = () => {
  const router = useRouter(); // Inicialize o hook useRouter

  const formLogin = useForm<z.infer<typeof FormLoginSchema>>({
    resolver: zodResolver(FormLoginSchema),
    defaultValues: {
      cnpj: '',
      password: '',
    },
  });

  const formCadastro = useForm<z.infer<typeof FormCadastroSchema>>({
    resolver: zodResolver(FormCadastroSchema),
    defaultValues: {
      cnpj: '',
      password: '',
      senhaRepetida: '',
      nome: '',
      email: '',
      ramo: '',
    },
  });
  const enviaToast = (title: string, description: string, backgroundColor: string, color: string) => {
    console.log('Toast enviado:', title, description, backgroundColor, color);
    toast({
      title: title,
      description: description,
      style: {
        backgroundColor: backgroundColor,
        color: color
      }
    });
  }

  const handleSumitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Antes de tudo temos que validas as informações do form
      const { cnpj, password } = await formLogin.getValues();

      // Validando os valores do formulario com zod
      try {
        FormLoginSchema.parse({ cnpj, password });
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          const errorMessage = validationError.errors.map((error) => error.message).join(', ');
          enviaToast(errorMessage, 'name', '#FF0000', 'white');
        }
        return; 
      }

      const response = await fetch('http://localhost:2800/loginLoja', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "cnpj": cnpj,
          "senha": password
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        const token = data.data.token;
        // Armazenando o token e o cnpj da loja logada no local storage
        localStorage.setItem('token', token);
        localStorage.setItem('cnpjLoja', cnpj);

        enviaToast("Login realizado com sucesso", "name", "#4CAF50", "white");
        console.log(token);
        formLogin.reset();
        // Redirecionar o usuário para a página desejada após o login bem-sucedido
        router.push('/produtosLoja');
      } else {
        enviaToast("Dados Incorretos", "name", "#FF0000", "white");
      }
    } catch (error) {
      enviaToast("Erro interno do servidor", "name", "#FF0000", "white");
      console.log(error)
    }
  }
  const handleSumitCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { cnpj, password, senhaRepetida, nome, email, ramo } = await formCadastro.getValues();
      try{
        FormCadastroSchema.parse({ cnpj, password, senhaRepetida, nome, email, ramo })
      }catch(validationError){
        if (validationError instanceof ZodError) {
          const errorMessage = validationError.errors.map((error) => error.message).join(', ');
          enviaToast(errorMessage, 'name', '#FF0000', 'white');
        }
        return; 
      }
      const response = await fetch('http://localhost:2800/cadastrarLoja', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "cnpjLoja": cnpj,
          "senha": password,
          "nome": nome,
          "email": email,
          "ramo": ramo
        }),
      });

      if (response.status === 200) {
        formCadastro.reset();
        formLogin.setValue("cnpj", cnpj);
        enviaToast("Cadastro realizado com sucesso", "name", "#4CAF50", "white");
      } else {
        enviaToast("Dados Incorretos", "name", "#FF0000", "white");
      }
    } catch (error) {
      enviaToast("Erro interno do servidor", "name", "#FF0000", "white");
      console.log(error)
    }
  }

  return (
    <div>
      <h1 className="flex justify-center text-4xl pt-10">Minha conta</h1>
      <div className="flex justify-center">
        <div className="flex items-center h-screen p-5">
          <div><Label className="flex justify-center mb-4 text-2xl">Entrar</Label>
            <div className="border p-10 shadow-xl rounded-lg bg-white">
              <Form {...formLogin}>
                <form onSubmit={handleSumitLogin} className="space-y-8">
                  <FormField
                    control={formLogin.control}
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center justify-center'>CNPJ</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formLogin.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='flex items-center justify-center'>Password</FormLabel>
                        <Input type="password" {...field} />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full" type="submit">Submit</Button>
                </form>
              </Form>
            </div>
          </div>
        </div>

        {/* Formulario de cadastro */}
        <div className="flex items-center h-screen p-5">
          <div><Label className="flex justify-center mb-4 text-2xl">Cadastre-se</Label>
            <div className="border p-10 shadow-xl rounded-lg bg-white">
              <Form {...formCadastro}>
                <form onSubmit={handleSumitCadastro} className="space-y-8">
                  <div className="flex items-center">

                    <div className="p-1.5">
                      <FormField
                        control={formCadastro.control}
                        name="cnpj"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center justify-center'>CNPJ</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="p-1.5">
                      <FormField
                        control={formCadastro.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center justify-center'>Password</FormLabel>
                            <Input type="password" {...field} />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="p-1.5">
                      <FormField
                        control={formCadastro.control}
                        name="senhaRepetida"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center justify-center'>senhaRepetida</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="p-1.5">
                      <FormField
                        control={formCadastro.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center justify-center'>nome</FormLabel>
                            <Input {...field} />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="p-1.5">
                      <FormField
                        control={formCadastro.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center justify-center'>email</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="p-1.5">
                      <FormField
                        control={formCadastro.control}
                        name="ramo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center justify-center'>ramo</FormLabel>
                            <Input {...field} />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <Button className="w-full" type="submit">Submit</Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;