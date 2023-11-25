"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'

// Importações de componentes
import { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage, } from '@/components/ui/form';
import { useToast, toast } from "@/components/ui/use-toast"

const FormSchema = z.object({
    QuantidadeEstoque: z.number().min(1, 'Precisa ter um valor numéricoo'),
    Preco: z.number().min(1, 'Precisa ter um valor numérico'),
});


export default function Home() {

    interface ProductItem {
        nome: string;
        categoria: string;
        descricao: string;
        url: string;
    }

    // Declarando o formulario pra adicionar um produto
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            QuantidadeEstoque: 0,
            Preco: 0,
        },
    });

    // Basicamente vamos chamar o setData em algum lugar do codigo para preencher o valor da variavel data que é uma lista do tipo ProductItem
    const [data, setData] = useState<ProductItem[]>([]);


    const itensLoja = async () => {
        try {
            // Pegando o token de login e o cnpj da loja logada
            const token = await localStorage.getItem('token');
            const cnpjLoja = await localStorage.getItem('cnpjLoja');

            const response = await fetch(`http://localhost:2800/produtosNaoOfertados/${cnpjLoja}`, {
                method: "GET",
                headers: { 'Authorization': `Bearer ${token}` },
            })
            if (response.status === 200) {
                const responseData = await response.json();
                // Colocando esse valor na variavel data
                setData(responseData);
            } else {
                console.error(`Erro na resposta: ${response.status} - ${response.statusText}`);
            }

        } catch (error) {
            console.log(error)
        }
    }

    // Pra executar a função quando a pagina for renderizada
    useEffect(() => {
        itensLoja();
    }, []);

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

    const handleSubmit = async (e: React.FormEvent, nomeProduto: String) => {
        e.preventDefault();
        try {
            const { QuantidadeEstoque, Preco } = form.getValues();
            const cnpjLoja = await localStorage.getItem('cnpjLoja'); // Precisa do cnpj para a rota

            const response = await fetch(`http://localhost:2800/cadastroProdutosEstoque`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "nome": nomeProduto,
                    "cnpjLoja": cnpjLoja,
                    "quantidadeEstoque": QuantidadeEstoque,
                    "preco": Preco
                  }),
            })
            if (response.status === 200) {
                enviaToast("Produto Ofertado com sucesso", "name", "#4CAF50", "white");
            } else {
                enviaToast("Erro ao Ofertar produto", "name", "#FF0000", "white");
            }
            form.reset();
            itensLoja(); // Carrega os itens novamente
        } catch (error) {
            enviaToast("Erro ao Ofertar produto", "name", "#FF0000", "white");
        }
    }

    return (
        <div>
            <Label className="flex justify-center text-4xl pt-10">Produtos Disponíveis</Label>
            <div className="flex flex-wrap">
                {data.map((item) => (
                    <div key={item.nome} className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 p-4">
                        <Card className="w-full h-[330px]">
                            <CardHeader>
                                <CardTitle>{item.nome}</CardTitle>
                            </CardHeader>
                            <div className='flex items-center justify-center'>
                                <img src={item.url} alt={item.nome} width={300} height={200} />
                            </div>
                            <CardContent className="text-center">
                                <Dialog>
                                    <DialogTrigger className="w-full"><Button className="w-full">Ofertar</Button></DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Informações do produto ofertado</DialogTitle>
                                            <Form {...form}>
                                                <form onSubmit={(e) => handleSubmit(e, item.nome)} className="space-y-8">

                                                    <FormField
                                                        control={form.control}
                                                        name="QuantidadeEstoque"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className='flex items-center justify-center'>Quantidade no Estoque</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="Preco"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className='flex items-center justify-center'>Preço</FormLabel>
                                                                <Input {...field} />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <DialogClose asChild>
                                                        <Button className="w-full" type="submit">Submit</Button>
                                                    </DialogClose>
                                                </form>
                                            </Form>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>

                            </CardContent>
                        </Card>
                    </div>
                ))
                }
            </div >
        </div>

    );
}