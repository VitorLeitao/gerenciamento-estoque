"use client";
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast, toast } from "@/components/ui/use-toast"
import * as z from 'zod';
import { Label } from "@/components/ui/label"
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


// Basicamente vai setar algumas condições para os valores do form
const FormSchema = z.object({
    nome: z.string().min(1, 'Precisa ter nome'),
    descricao: z
        .string()
        .min(1, 'Descrição muito curta')
        .min(8, 'Descrição muito grande'),
    categoria: z.string().min(1, 'Precisa ter uma categoria'),
    url: z.string().min(1, 'Precisa ter uma categoria'),
});

interface produtoCreate {
    nome: string,
    descricao: string,
    categoria: string,
    url: string
}

const cadastrarProdutoUnico = (novoProduto: produtoCreate) => {
    // Declarando o formulario pra adicionar um produto
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nome: '',
            descricao: '',
            categoria: '',
            url: '',
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

    const handleSumit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Obtendo os valores do formulário usando o objeto form
        const { nome, descricao, categoria, url } = await form.getValues();
        const instanciaProduto: produtoCreate = {
            nome: nome,
            descricao: descricao,
            categoria: categoria,
            url: url,
        };
        console.log(JSON.stringify(instanciaProduto));

        // Vamos usar essa instancia para chamar nossa rota
        try {
            // Pegando o token de login
            const token = await localStorage.getItem('token');
            const response = await fetch('http://localhost:2800/criarProdutoGeral', {
                method: "POST",
                headers: { 'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`}, // Enviando o token
                body: JSON.stringify(instanciaProduto),
            });
            console.log(response);
            if (response.status === 200) {
                enviaToast("Produto adicionado com sucesso", "name", "#4CAF50", "white");
                form.reset();
            } else {
                enviaToast("Erro ao adicionar produto", "name", "#FF0000", "white");
            }
        } catch (error) {
            enviaToast("Erro ao adicionar produto", "name", "#FF0000", "white");
        }
    }

    return (
        <div>
            <Label className="flex justify-center text-4xl pt-10">Cadastrar produto</Label>
            <div className="flex items-center justify-center h-screen border">
                <div className="border p-10 shadow-xl rounded-lg bg-white">
                    <Form {...form}>
                        <form onSubmit={handleSumit} className="space-y-8">

                            <FormField 
                                control={form.control}
                                name="nome"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center justify-center'>Nome</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="descricao"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center justify-center'>Descricao</FormLabel>
                                        <Input {...field} />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="categoria"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center justify-center'>Categoria</FormLabel>
                                        <Input {...field} />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center justify-center'>url</FormLabel>
                                        <Input {...field} />
                                    </FormItem>
                                )}
                            />
                            <Button className="w-full" type="submit">Submit</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default cadastrarProdutoUnico;