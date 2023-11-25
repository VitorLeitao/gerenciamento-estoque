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
  reajuste: z.number().min(1, 'Precisa ter um valor numéricoo'),
  desconto: z.number().min(1, 'Precisa ter um valor numérico'),
  fornecimento: z.number().min(1, 'Precisa ter um valor numérico'),
  venda: z.number().min(1, 'Precisa ter um valor numérico'),
});


export default function Home() {

  interface ProductItem {
    precoProduto: number;
    quantidadeEstoque: number;
    Product: {
      nome: string;
      categoria: string;
      descricao: string;
      url: string;
    };
  }

  // Declarando o formulario pra adicionar um produto
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reajuste: 0,
      desconto: 0,
      fornecimento: 0,
      venda: 0,
    },
  });

  // Basicamente vamos chamar o setData em algum lugar do codigo para preencher o valor da variavel data que é uma lista do tipo ProductItem
  const [data, setData] = useState<ProductItem[]>([]);


  const itensLoja = async () => {
    try {
      // Pegando o token de login e o cnpj da loja logada
      const token = await localStorage.getItem('token');
      const cnpjLoja = await localStorage.getItem('cnpjLoja');

      const response = await fetch(`http://localhost:2800/produtosByCNPJ/${cnpjLoja}`, {
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
  const handleDelete = async (e: React.FormEvent, nomeProduto: String) => {
    e.preventDefault();
    try{
      const cnpjLoja = await localStorage.getItem('cnpjLoja'); // Precisa do cnpj para a rota

      const response = await fetch(`http://localhost:2800/cancelarOfertaProduto`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "nomeProduto": nomeProduto,
          "cnpj": cnpjLoja,
        }),
      })
    
      if (response.status === 200){
        enviaToast("Produto deletado com sucesso", "name", "#4CAF50", "white");
      }else{
        enviaToast("Erro ao deletar produto", "name", "#FF0000", "white");
      }
      form.reset();
      itensLoja(); // Carrega os itens novamente
    }catch{
      enviaToast("Erro ao deletar produto", "name", "#FF0000", "white");
    }

  }

  const handleSubmit = async (e: React.FormEvent, nomeProduto: String) => {
    e.preventDefault();
    const { reajuste, desconto, fornecimento, venda } = form.getValues();
    const cnpjLoja = await localStorage.getItem('cnpjLoja'); // Precisa do cnpj para a rota

    // Caso seja um reajuste no preço
    if ((reajuste != 0) || (desconto != 0)) {
      let tipoReajuste = '';
      let reajusteCompleto = 0;
      if (reajuste != 0) {
        tipoReajuste = 'aumento';
        reajusteCompleto = reajuste;
      } else {
        tipoReajuste = 'desconto';
        reajusteCompleto = desconto;
      }
      const response = await fetch(`http://localhost:2800/reajustePreco`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "nomeProduto": nomeProduto,
          "cnpj": cnpjLoja,
          "porcentagemMudanca": reajusteCompleto,
          "tipoReajuste": tipoReajuste
        }),
      })

      if (response.status === 200) {
        enviaToast("Preço alterado com sucesso", "name", "#4CAF50", "white");
        // Colocar isso no final para conseguir fazer reajuste no estoque e preço num so forms
      } else {
        enviaToast("Erro ao alterar preço", "name", "#FF0000", "white");
      }
    }

    // Caso seja um reajuste no estoque
    if ((fornecimento != 0) || (venda != 0)) {
      let tipoReajuste = '';
      let reajusteCompleto = 0;
      if (fornecimento != 0) {
        tipoReajuste = 'fornecimento';
        reajusteCompleto = fornecimento;
      } else {
        tipoReajuste = 'venda';
        reajusteCompleto = venda;
      }
      const response = await fetch(`http://localhost:2800/alterarEstoque`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "nomeProduto": nomeProduto,
          "cnpj": cnpjLoja,
          "quantidadeMudanca": reajusteCompleto,
          "tipoReajuste": tipoReajuste
        }),
      })
      console.log(tipoReajuste);

      if (response.status === 200) {
        enviaToast("Estoque alterado com sucesso", "name", "#4CAF50", "white");
      } else {
        enviaToast("Erro ao alterar Estoque", "name", "#FF0000", "white");
      }
    }
    form.reset();
    itensLoja(); // Mostrar o novo preço

  }

  return (
    <div>
      <Label className="flex justify-center text-4xl pt-10">Meus Produtos</Label>
      <div className="flex flex-wrap">
        {data.map((item) => (
          <div key={item.Product.nome} className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 p-4">
            <Card className="w-full h-[390px]">
              <CardHeader>
                <CardTitle>{item.Product.nome}</CardTitle>
              </CardHeader>
              <div className='flex items-center justify-center'>
                <img src={item.Product.url} alt={item.Product.nome} width={300} height={200} />
              </div>
              <CardContent className="text-center">
                <p>R${item.precoProduto}</p>
                <p>{item.quantidadeEstoque} Disponíveis</p>
                <Dialog>
                  <DialogTrigger className="w-full"><Button className="w-full"> Alterar</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Alterações no Preço ou Estoque</DialogTitle>
                      <Form {...form}>
                        <form onSubmit={(e) => handleSubmit(e, item.Product.nome)} className="space-y-8">

                          <FormField
                            control={form.control}
                            name="reajuste"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='flex items-center justify-center'>Reajuste</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="desconto"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='flex items-center justify-center'>Desconto</FormLabel>
                                <Input {...field} />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="fornecimento"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='flex items-center justify-center'>Fornecimento</FormLabel>
                                <Input {...field} />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="venda"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='flex items-center justify-center'>Venda</FormLabel>
                                <Input {...field} />
                              </FormItem>
                            )}
                          />
                          <div className="flex space-x-4">
                          <DialogClose asChild>
                              <Button className="w-full bg-red-500" onClick={(e) => handleDelete(e, item.Product.nome)}>Delete product</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button className="w-full" type="submit">Submit</Button>
                            </DialogClose>
                          </div>
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