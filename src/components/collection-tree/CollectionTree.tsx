'use client';

import {ChevronDown, ChevronRight} from "lucide-react";

import {useState} from "react";
import styles from "./CollectionTree.module.css";

interface Collection {
    _id: string;
    name: string;
    description?: string;
    licence?: string;
    children: Collection[];
}

type Props = {
    collections: Collection[];
    selectable?: boolean;
    onSelect?: (col: Collection) => void;
    selectedId?: string | null;
    isRoot?: boolean;
    header?: React.ReactNode;
};

function CollectionTree({collections, selectable = false, onSelect, selectedId = null, isRoot = true, header}: Props) {
    if (!collections || collections.length === 0) {
        if (isRoot && header) {
            return (
                <div className={styles['treeContainer']}>
                    {header}
                    <ul className={styles['collections']}/>
                </div>
            );
        }
        return null;
    }
    if (isRoot) {
        return (
            <div className={styles['treeContainer']}>
                {header}
                <ul className={styles['collections']}>
                    {collections.map(col => (
                        <CollectionItem key={col._id} collection={col} selectable={selectable} onSelect={onSelect}
                                        selectedId={selectedId}/>
                    ))}
                </ul>
            </div>
        );
    }
    return (
        <ul className={styles['subCollections']}>
            {collections.map(col => (
                <CollectionItem key={col._id} collection={col} selectable={selectable} onSelect={onSelect}
                                selectedId={selectedId}/>
            ))}
        </ul>
    );
}

function CollectionItem({collection, selectable = false, onSelect, selectedId}: {
    collection: Collection;
    selectable?: boolean;
    onSelect?: (c: Collection) => void;
    selectedId?: string | null
}) {
    const [open, setOpen] = useState(false);
    const hasChildren = collection.children && collection.children.length > 0;
    const isSelected = selectedId === collection._id;

    const itemStyle: React.CSSProperties = {
        background: 'transparent',
        border: 'none',
        color: 'var(--ub-red)',
        fontSize: '1.15rem',
        fontWeight: 500,
        padding: '0.75rem',
        textDecoration: 'none',
        display: 'block',
        width: '100%',
        textAlign: 'left'
    };

    return (
        <li>
            <div className={styles['collection-row']}>
                {hasChildren ? (
                    <button
                        type="button"
                        className={styles['toggle-btn']}
                        aria-label={open ? 'Colapsar' : 'Expandir'}
                        onClick={() => setOpen(o => !o)}
                    >
                        {open ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                    </button>
                ) : <div className={styles['toggle-btn']}/>}
                {selectable ? (
                    <button type="button" className={`${styles['collection']} ${isSelected ? styles['selected'] : ''}`} onClick={() => onSelect?.(collection)} style={itemStyle}>
                        {collection.name}
                    </button>
                ) : (
                    <a href={`/repositorio/coleccion/${collection._id}`} className={styles['collection']} style={itemStyle}>
                        {collection.name}
                    </a>
                )}
            </div>
            {hasChildren && open && (
                <CollectionTree collections={collection.children} selectable={selectable} onSelect={onSelect}
                                selectedId={selectedId} isRoot={false}/>
            )}
        </li>
    );
}

export default CollectionTree;
