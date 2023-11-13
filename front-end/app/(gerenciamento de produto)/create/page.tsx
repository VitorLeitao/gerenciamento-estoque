"use client";
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as z from 'zod';
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
});

interface produtoCreate {
    nome: string,
    descricao: string,
    categoria: string
}

const cadastrarProdutoUnico = (novoProduto: produtoCreate) => {
    // Declarando o formulario pra adicionar um produto
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nome: '',
            descricao: '',
            categoria: ''
        },
    });

    const handleClick = () => {
        alert('Clicou no botao!');
    }

    const handleSumit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Formulario recibio");
    }
    return (
        <div>
            <h1>Criação de produto</h1>
            <div>
                <Form {...form}>
                    <form onSubmit={handleSumit} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="nome"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="descricao"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Descricao</FormLabel>
                                    <Input />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categoria"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    <Input />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default cadastrarProdutoUnico;