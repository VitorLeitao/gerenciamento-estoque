"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

  // Basicamente vamos chamar o setData em algum lugar do codigo para preencher o valor da variavel data que é uma lista do tipo ProductItem
  const [data, setData] = useState<ProductItem[]>([]);

  // Mudar para na autorização pegar isso automaticamente
  const cnpjLoja = '1234';


  const itensLoja = async () => {
    try {
      const response = await fetch(`http://localhost:2800/produtosByCNPJ/${cnpjLoja}`)
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


  return (
    <div className="flex flex-wrap">
      {data.map((item) => (
        <div key={item.Product.nome} className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 xl:w-1/4 p-4">
          <Card className="w-full h-[400px]">
            <CardHeader>
              <CardTitle>{item.Product.nome}</CardTitle>
            </CardHeader>
            <div className='flex items-center justify-center'>
              <Image src={item.Product.url} alt={item.Product.nome} width={300} height={200} />
            </div>
            <CardContent>
              <p>Card Content for {item.Product.nome}</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer for {item.Product.nome}</p>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
}