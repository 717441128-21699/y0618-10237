import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { Button } from "@/components/Button";
import { ChipInput } from "@/components/ChipInput";
import { Tag } from "@/components/Tag";
import { useStore } from "@/store/useStore";
import {
  PREFERENCE_TAG_LIST,
  COMMON_ALLERGENS,
  type Product,
  type ProductCategory,
  type PreferenceTag,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORIES: ProductCategory[] = ["运动", "美食", "美妆", "文创", "科技", "家居", "香氛", "户外"];

interface Props {
  open: boolean;
  onClose: () => void;
  editing: Product | null;
}

export function ProductEditModal({ open, onClose, editing }: Props) {
  const addProduct = useStore((s) => s.addProduct);
  const updateProduct = useStore((s) => s.updateProduct);

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProductCategory>("运动");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<PreferenceTag[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [image, setImage] = useState("");

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setCategory(editing.category);
      setDescription(editing.description);
      setTags(editing.tags);
      setAllergens(editing.allergens);
      setImage(editing.image);
    } else {
      setName("");
      setCategory("运动");
      setDescription("");
      setTags([]);
      setAllergens([]);
      setImage("");
    }
  }, [editing, open]);

  const toggleTag = (t: PreferenceTag) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const save = () => {
    if (!name.trim()) return;
    const img =
      image ||
      `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
        `${name} ${category} product on dark surface studio photography`,
      )}&image_size=square_hd`;
    if (editing) {
      updateProduct(editing.id, { name, category, description, tags, allergens, image: img });
    } else {
      addProduct({ name, category, description, tags, allergens, image: img });
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "编辑商品" : "新增商品"}
      description="维护商品信息、偏好标签与过敏成分"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>取消</Button>
          <Button onClick={save} disabled={!name.trim()}>保存</Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-wider text-cream-400 mb-2 block">商品名称</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="如：冷感运动毛巾"
              className="w-full rounded-xl border border-cream-100/15 bg-ink-800 px-4 py-2.5 text-sm text-cream-100 outline-none focus:border-amber-300/60"
            />
          </label>
          <label className="block">
            <span className="text-xs font-mono uppercase tracking-wider text-cream-400 mb-2 block">品类</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className="w-full rounded-xl border border-cream-100/15 bg-ink-800 px-4 py-2.5 text-sm text-cream-100 outline-none focus:border-amber-300/60"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-ink-800">{c}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wider text-cream-400 mb-2 block">商品描述</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="简短描述商品卖点…"
            rows={2}
            className="w-full rounded-xl border border-cream-100/15 bg-ink-800 px-4 py-2.5 text-sm text-cream-100 outline-none focus:border-amber-300/60 resize-none"
          />
        </label>

        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-cream-400 mb-2 block">偏好标签</span>
          <div className="flex flex-wrap gap-2">
            {PREFERENCE_TAG_LIST.map((t) => (
              <Tag key={t} selected={tags.includes(t)} onClick={() => toggleTag(t)}>{t}</Tag>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-coral-300 mb-2 block">过敏成分</span>
          <ChipInput
            values={allergens}
            onChange={setAllergens}
            suggestions={COMMON_ALLERGENS}
            placeholder="输入过敏成分，回车添加"
            variant="allergen"
          />
        </div>

        <label className="block">
          <span className="text-xs font-mono uppercase tracking-wider text-cream-400 mb-2 block">商品图片 URL（可选）</span>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="留空将自动生成示意图"
            className="w-full rounded-xl border border-cream-100/15 bg-ink-800 px-4 py-2.5 text-sm text-cream-100 outline-none focus:border-amber-300/60"
          />
          {(image || name) && (
            <div className={cn("mt-3 w-24 h-24 rounded-xl overflow-hidden bg-ink-800")}>
              <img
                src={image || `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(`${name} ${category} product`)}&image_size=square_hd`}
                alt="预览"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </label>
      </div>
    </Modal>
  );
}
