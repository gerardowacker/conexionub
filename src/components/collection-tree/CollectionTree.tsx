'use client';
import { useState } from "react";
import styles from "./CollectionTree.module.css";

interface Collection {
    _id: string;
    name: string;
    description?: string;
    licence?: string;
    children: Collection[];
}

function CollectionTree({ collections }: { collections: Collection[] }) {
    if (!collections || collections.length === 0) return null;
    return (
        <ul className={styles['collections']}>
            {collections.map(col => (
                <CollectionItem key={col._id} collection={col} />
            ))}
        </ul>
    );
}

function CollectionItem({ collection }: { collection: Collection }) {
    const [open, setOpen] = useState(false);
    const hasChildren = collection.children && collection.children.length > 0;
    return (
        <li>
            <div className={styles['collection-row']}>
                {hasChildren && (
                    <button
                        type="button"
                        className={styles['toggle-btn']}
                        aria-label={open ? 'Colapsar' : 'Expandir'}
                        onClick={() => setOpen(o => !o)}
                    >
                        {open ? '▼' : '►'}
                    </button>
                )}
                <a href={`/repositorio/coleccion/${collection._id}`} className={styles['collection']}>
                    {collection.name}
                </a>
            </div>
            {hasChildren && open && (
                <CollectionTree collections={collection.children} />
            )}
        </li>
    );
}

export default CollectionTree;
