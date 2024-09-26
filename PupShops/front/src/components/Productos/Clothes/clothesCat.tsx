"use client";

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cartContext } from "@/context/cartContext";
import { IProduct } from "@/Interfaces/ICart"; // Asegúrate de que la ruta sea correcta

const ITEMS_PER_PAGE = 5;

const ClothesCat: React.FC = () => {
  const router = useRouter();
  const { addToCart } = useContext(cartContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const categoryId = "2c5d9c21-1997-4311-b7ca-e9362c05aa2a";

  // Cambiamos el estado quantity para ser un objeto
  const [quantity, setQuantity] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/products/child/${categoryId}`
        );

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Error ${response.status}: ${errorMessage}`);
        }

        const data: IProduct[] = await response.json();

        const formattedData = data.map((product) => ({
          ...product,
          price: Number(product.price),
        }));

        setProducts(formattedData);
        // Inicializamos la cantidad para cada producto
        const initialQuantity = formattedData.reduce((acc, product) => {
          acc[product.id] = 1; // Inicializamos la cantidad en 1
          return acc;
        }, {} as { [key: number]: number });
        setQuantity(initialQuantity);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (loading) return <div>Cargando productos...</div>;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Función para incrementar o disminuir la cantidad de un producto específico
  const updateQuantity = (
    productId: number,
    operation: "increment" | "decrement"
  ) => {
    setQuantity((prevQuantities) => ({
      ...prevQuantities,
      [productId]:
        operation === "increment"
          ? (prevQuantities[productId] || 1) + 1
          : Math.max((prevQuantities[productId] || 1) - 1, 1),
    }));
  };

  return (
    <div className="container mx-auto p-4 bg-slate-50">
      <h1 className="text-2xl text-center font-bold mb-4">Ropa para Gatos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {currentProducts.map((product) => (
          <div
            key={product.id} // Usa product.id como clave si es único
            className="border p-4 rounded-lg shadow-md cursor-pointer flex flex-col justify-between h-full"
            onClick={() => router.push("/Categorias/Ropa/Gato")}
          >
            <div className="flex flex-col items-center">
              <Image
                src={product.imgUrl}
                alt={product.name}
                width={300}
                height={300}
                className="object-contain rounded-md w-full h-60 mb-4"
              />
              <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-700 mb-2">{product.description}</p>
              <p className="text-green-600 font-bold mb-2">
                ${product.price.toFixed(2)}
              </p>
              {/* Sección de cantidad */}
              <div className="flex items-center space-x-4 mb-4">
                <button
                  className="px-3 py-1 bg-gray-300 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, "decrement");
                  }}
                >
                  -
                </button>
                <span>{quantity[product.id] || 1}</span>{" "}
                {/* Mostrar la cantidad específica */}
                <button
                  className="px-3 py-1 bg-gray-300 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, "increment");
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <button
              className="mt-auto bg-teal-600 text-white py-2 rounded-md hover:bg-orange-300 hover:text-black transition"
              onClick={async (e) => {
                e.stopPropagation();
                const success = await addToCart(
                  product.id,
                  quantity[product.id] || 1
                ); // Pasar cantidad específica a la función addToCart
                if (success) {
                  alert(
                    `${quantity[product.id] || 1} unidades de ${
                      product.name
                    } han sido agregadas al carrito`
                  );
                } else {
                  alert(`${product.name} ya está en el carrito`);
                }
              }}
            >
              Agregar {quantity[product.id] || 1} al Carrito
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-3 px-3 py-1 rounded-md ${
              currentPage === index + 1
                ? "bg-teal-600 text-white"
                : "bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClothesCat;
