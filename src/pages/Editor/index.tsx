import { Card } from 'antd';
import JoditEditor, { IJoditEditorProps, Jodit } from 'jodit-react';
import React, { useMemo, useRef, useState } from 'react';
import uploadImageIcon from '../../assets/upload.png';
import { useCreateImageMutation } from '../../services/images.service';
import { editorButtons } from './components';

interface EditorProps {
  value?: string;
}
export function Editor({ value }: EditorProps) {
  const editor = useRef(null);
  const [content, setContent] = useState(value || '');

  const [uploadImage] = useCreateImageMutation();

  const FileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('images', file);

    const res = await uploadImage(formData).unwrap();
    const [link] = res.links;
    return link;
  };
  const insertImage = (editor: Jodit, url: string) => {
    const image = editor.selection.jodit.createInside.element('img');
    image.setAttribute('src', url);
    image.setAttribute('style', 'max-height: 300px');
    editor.selection.insertNode(image);
  };
  const imageUpload = async (editor: Jodit) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const imageFile = input.files ? input.files[0] : null;

      if (!imageFile) {
        return;
      }

      if (!imageFile.name.match(/\.(jpg|jpeg|png)$/)) {
        return;
      }

      const imageInfo = await FileUpload(imageFile);

      insertImage(editor, imageInfo);
    };
  };

  const config: IJoditEditorProps['config'] = useMemo(
    () => ({
      enableDragAndDropFileToEditor: true,
      language: 'pt_br',
      imageProcessor: {
        replaceDataURIToBlobIdInView: false,
      },
      tabIndex: 1,
      showTooltipDelay: 100,
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      editHTMLDocumentMode: true,
      removeButtons: ['image'],
      extraButtons: [
        {
          name: 'Carregar Imagem',
          tooltip: 'Carregar Imagem',
          iconURL: uploadImageIcon,
          exec: async (editor: Jodit) => {
            await imageUpload(editor);
          },
        },
        {
          name: 'Título',
          tooltip: 'Título sem imagem',
          exec: (editor: Jodit) => {
            editor.selection.insertHTML(editorButtons.title);
          },
        },
        {
          name: 'Título 2',
          tooltip: 'Título com imagem',
          exec: (editor: Jodit) => {
            editor.selection.insertHTML(editorButtons.titleWithImage);
          },
        },
        {
          name: 'Texto Imagem',
          tooltip: 'Texto com imagem',
          exec: (editor: Jodit) => {
            editor.selection.insertHTML(editorButtons.textWithImage);
          },
        },
        {
          name: 'Texto',
          tooltip: 'Texto Centralizado',
          exec: (editor: Jodit) => {
            editor.selection.insertHTML(editorButtons.text);
          },
        },
        {
          name: 'Colunas com Imagens',
          tooltip: 'Múltiplas Colunas com Texto e Imagens',
          exec: (editor: Jodit) => {
            editor.selection.insertHTML(editorButtons.textWithMultipleColumns);
          },
        },
        {
          name: 'Colunas com Texto',
          tooltip: 'Múltiplas Colunas com Texto',
          exec: (editor: Jodit) => {
            editor.selection.insertHTML(editorButtons.textWithColumns);
          },
        },
        {
          name: 'Lista',
          tooltip: 'Lista',
          exec: (editor: Jodit) => {
            editor.selection.insertHTML(editorButtons.list);
          },
        },
        {
          name: 'Múltiplas Imagens',
          tooltip: 'Container de Imagens com Legendas',
          exec: (editor: Jodit) => {
            editor.selection.insertHTML(editorButtons.imageContainer);
          },
        },
        {
          name: 'Caixa de Mensagem 1',
          tooltip: 'Caixa de Mensagem com Imagem a Direita',
          exec: (editor: Jodit) => {
            editor.selection.insertHTML(editorButtons.boxMessageWithImageRight);
          },
        },
        {
          name: 'Caixa de Mensagem 2',
          tooltip: 'Caixa de Mensagem com Imagem a Esquerda',
          exec: (editor: Jodit) => {
            editor.selection.insertHTML(editorButtons.boxMessageWithImageLeft);
          },
        },
        {
          name: 'Caixa de Mensagem 3',
          tooltip: 'Caixa de Mensagem com Imagem Dentro',
          exec: (editor: Jodit) => {
            editor.selection.insertHTML(editorButtons.boxMessageWithImageInside);
          },
        },
        {
          name: 'Caixa de Mensagem 4',
          tooltip: 'Caixa de Mensagem com Ícone Dentro',
          exec: (editor: Jodit) => {
            editor.selection.insertHTML(editorButtons.boxMessageWithIconInside);
          },
        },
        {
          name: 'Caixa de Imagem',
          tooltip: 'Caixa de imagem',
          exec: (editor: Jodit) => {
            editor.selection.insertHTML(editorButtons.boxImage);
          },
        },
      ],
    }),
    [editorButtons],
  );

  return (
    <Card>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onBlur={setContent} // preferred to use only this option to update the content for performance reasons
        onChange={() => {
          /* empty */
        }}
      />
    </Card>
  );
}

Editor.defaultProps = {
  value: '',
};
