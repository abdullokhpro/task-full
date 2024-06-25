"use client";

import React, { useState, ChangeEvent, FC } from "react";
import SideBar from "@/compnents/sidebar/SideBar";
import "./manage-prduct.scss";

import { MdDelete, MdEdit } from "react-icons/md";
import EditModule from "@/compnents/editModule/editModule";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useUpdateProductMutation,
} from "@/store/productSlice/productApi";

interface Product {
  id: number;
  title: string;
  job: string;
  email: string;
  tel: string;
}

const ManageProduct: FC = () => {
  const { data: products, isLoading, isError } = useGetAllProductsQuery();

  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [filterTerm, setFilterTerm] = useState<string>("");
  const [showEditModule, setShowEditModule] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure?")) {
      await deleteProduct(id);
    }
  };

  const handleUpdate = (product: Product) => {
    setCurrentProduct(product);
    setShowEditModule(true);
  };

  const handleSaveUpdate = async (updatedProduct: Product) => {
    await updateProduct({ id: updatedProduct.id, body: updatedProduct });
    setShowEditModule(false);
  };

  let filteredProducts = products;

  if (filterTerm) {
    filteredProducts = products?.filter((product: Product) =>
      product.job.toLowerCase().includes(filterTerm.toLowerCase())
    );
  }

  const productData = filteredProducts?.map((el: Product) => (
    <div key={el.id} className="manage-product__card">
      <div className="manage-product__info">
        <p>Id</p>
        <p>Name</p>
        <p>Job</p>
        <p>email</p>
        <p>tel</p>
      </div>
      <div className="manage-product__card__left">
        <p>{el.id}</p>
        <p>{el.title}</p>
        <p>{el.job}</p>
        <p>{el.email}</p>
        <p>{el.tel}</p>
      </div>
      <div className="manage-product__btns">
        <button
          className="manage-product__btn"
          onClick={() => handleDelete(el.id)}
        >
          <MdDelete className="manage-product__icon manage-product__icon-delete" />
        </button>
        <button
          className="manage-product__btn"
          onClick={() => handleUpdate(el)}
        >
          <MdEdit className="manage-product__icon manage-product__icon-edit" />
        </button>
      </div>
    </div>
  ));

  return (
    <div className="manage-product">
      <SideBar />
      <div className="manage-product__right">
        <div className="manage-product__filter">
          <input
            type="text"
            placeholder="Filter by Job Title"
            value={filterTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFilterTerm(e.target.value)
            }
            className="manage-product__search"
          />
        </div>
        <div className="manage-product__cards">{productData}</div>
      </div>
      {showEditModule && currentProduct && (
        <>
          <EditModule
            setShowEditModule={setShowEditModule}
            product={currentProduct}
            onSave={handleSaveUpdate}
          />
          <div
            onClick={() => setShowEditModule(false)}
            className="overlay"
          ></div>
        </>
      )}
    </div>
  );
};

export default ManageProduct;
