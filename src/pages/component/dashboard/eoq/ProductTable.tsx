import React, {useState} from "react";

interface Product {
  name: string;
  stock: number;
  eoq: {
    reorderPoint: number;
  };
}

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6; // Número de productos por página

  // Calcular el índice de los productos a mostrar en la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Productos de stock críticos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock actual</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Punto de reorden</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentProducts.map((product, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.eoq.reorderPoint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between p-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}