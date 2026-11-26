import { useEffect } from "react";
import { useForm } from "react-hook-form";

const fields = [
  { name: "name", label: "Product name", required: true },
  { name: "brand", label: "Brand", required: true },
  { name: "category", label: "Category", required: true },
  { name: "subcategory", label: "Subcategory", required: true },
  { name: "sku", label: "SKU", required: true },
  { name: "price", label: "Price (₹)", type: "number", required: true },
  { name: "oldPrice", label: "Previous price (₹)", type: "number" },
  { name: "stock", label: "Stock quantity", type: "number", required: true },
  { name: "image", label: "Image path or URL", required: true },
];

export default function ProductForm({
  product,
  busy,
  onCancel,
  onSave,
  apiError,
}) {
  const defaults = product
    ? {
        ...product,
        tagsText: product.tags?.join(", ") || "",
        specificationsText: JSON.stringify(product.specs || {}, null, 2),
      }
    : { stock: 0, tagsText: "", specificationsText: "{}" };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: defaults });
  useEffect(() => {
    reset(
      product
        ? {
            ...product,
            tagsText: product.tags?.join(", ") || "",
            specificationsText: JSON.stringify(product.specs || {}, null, 2),
          }
        : { stock: 0, tagsText: "", specificationsText: "{}" },
    );
  }, [product, reset]);

  const submit = (values) => {
    let specs = product?.specs || {};
    try {
      if (values.specificationsText.trim())
        specs = JSON.parse(values.specificationsText);
    } catch {
      return;
    }
    const price = Number(values.price);
    const oldPrice =
      values.oldPrice === "" || values.oldPrice == null
        ? null
        : Number(values.oldPrice);
    const image = values.image.trim();
    const record = {
      ...product,
      ...values,
      price,
      oldPrice,
      stock: Number(values.stock),
      image,
      gallery: product?.gallery?.length ? product.gallery : [image],
      tags: values.tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      specs,
      rating: product?.rating ?? 0,
      reviews: product?.reviews ?? 0,
      discount: oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0,
    };
    delete record.specificationsText;
    delete record.tagsText;
    onSave(record);
  };

  return (
    <form className="admin-form" noValidate onSubmit={handleSubmit(submit)}>
      {apiError && <p className="admin-alert admin-form-error">{apiError}</p>}
      {fields.map(({ name, label, type = "text", required }) => (
        <label key={name} className={name === "image" ? "wide" : ""}>
          {label}
          <input
            type={type}
            step={type === "number" ? "any" : undefined}
            {...register(name, {
              required: required ? `${label} is required.` : false,
              ...(name === "price" && {
                min: {
                  value: 0.01,
                  message: "Price must be greater than zero.",
                },
                valueAsNumber: true,
              }),
              ...(name === "oldPrice" && {
                min: {
                  value: 0,
                  message: "Previous price cannot be negative.",
                },
              }),
              ...(name === "stock" && {
                min: { value: 0, message: "Stock cannot be negative." },
                valueAsNumber: true,
              }),
            })}
          />
          {errors[name] && (
            <small className="field-error">{errors[name].message}</small>
          )}
        </label>
      ))}
      <label className="wide">
        Description
        <textarea
          {...register("description", { required: "Description is required." })}
        />
        {errors.description && (
          <small className="field-error">{errors.description.message}</small>
        )}
      </label>
      <label>
        Tags (comma separated)
        <input {...register("tagsText")} />
      </label>
      <label className="wide">
        Specifications (JSON object)
        <textarea
          {...register("specificationsText", {
            validate: (value) => {
              try {
                return (
                  !value.trim() ||
                  (JSON.parse(value) &&
                    typeof JSON.parse(value) === "object" &&
                    !Array.isArray(JSON.parse(value))) ||
                  "Enter a JSON object."
                );
              } catch {
                return "Enter valid JSON for specifications.";
              }
            },
          })}
        />
        {errors.specificationsText && (
          <small className="field-error">
            {errors.specificationsText.message}
          </small>
        )}
      </label>
      <div className="admin-form-actions">
        <button
          type="button"
          className="admin-button"
          onClick={onCancel}
          disabled={busy}
        >
          Cancel
        </button>
        <button className="admin-button primary" disabled={busy}>
          {busy ? "Saving…" : product ? "Save changes" : "Add product"}
        </button>
      </div>
    </form>
  );
}
