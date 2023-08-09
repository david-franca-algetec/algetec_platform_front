import { ArrowLeftOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { Button, Card, Col, Form, Input, message, Row, Space } from 'antd';
import JoditEditor, { IJoditEditorProps, Jodit } from 'jodit-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import uploadImageIcon from '../../assets/upload.png';
import { handleError } from '../../helpers';
import { useCreateImageMutation } from '../../services/images.service';
import {
  TemplateCreate,
  useCreateTemplateMutation,
  useShowTemplateQuery,
  useUpdateTemplateMutation,
} from '../../services/templates.service';
import { editorButtons } from './components';

export function CreatePractice() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [toast, contextHolder] = message.useMessage();
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [createTemplate, { isLoading, isSuccess, isError, error }] = useCreateTemplateMutation();
  const [
    updateTemplate,
    { isLoading: updateIsLoading, isSuccess: updateIsSuccess, isError: updateIsError, error: updateError },
  ] = useUpdateTemplateMutation();
  const { data: templateData, isLoading: templateIsLoading } = useShowTemplateQuery(Number(id) || skipToken);
  const [uploadImage] = useCreateImageMutation();

  const [form] = Form.useForm<TemplateCreate>();

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

  const onFinish = (values: TemplateCreate) => {
    if (id) {
      updateTemplate({ id: Number(id), name: values.name, content });
    } else {
      createTemplate({ name: values.name, content });
    }
  };

  const config: IJoditEditorProps['config'] = useMemo(
    () => ({
      // controls: {
      //   font: {
      //     list: {
      //       'Roboto Medium,Arial,sans-serif': 'Roboto',
      //     },
      //   },
      // },
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

  useEffect(() => {
    if (isError && error && 'data' in error) {
      toast.error(handleError(error)).then();
    }
    if (isSuccess) {
      form.resetFields();
      toast.success('Template adicionado com sucesso').then();
    }
  }, [isError, isSuccess, error]);

  useEffect(() => {
    if (updateIsError && updateError && 'data' in updateError) {
      toast.error(handleError(updateError)).then();
    }
    if (updateIsSuccess) {
      toast.success('Template atualizado com sucesso').then();
    }
  }, [updateIsError, updateIsSuccess, updateError]);

  useEffect(() => {
    if (id && templateData && !templateIsLoading) {
      form.setFieldsValue({
        content: templateData.content,
        name: templateData.name,
      });
      setContent(templateData.content);
    }
  }, [id, templateData, templateIsLoading]);

  return (
    <>
      <Row>
        <Col span={24}>
          <div className="flex items-center justify-between w-full pb-4">
            <div className="flex justify-center">
              <Button
                className="text-xl font-bold"
                icon={<ArrowLeftOutlined />}
                type="text"
                onClick={() => navigate(-1)}
              >
                {id ? 'Editar' : 'Adicionar'}
              </Button>
            </div>
            <Space>
              <Button icon={<UnorderedListOutlined />} onClick={() => navigate(`/editor`)}>
                Templates
              </Button>
            </Space>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Card>
            {contextHolder}
            <Form layout="vertical" form={form} onFinish={onFinish}>
              <Form.Item
                label="Título"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'O título é obrigatório',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Conteúdo" name="content">
                <JoditEditor
                  ref={editor}
                  value={content}
                  config={config}
                  onBlur={setContent} // preferred to use only this option to update the content for performance reasons
                />
              </Form.Item>
              <Form.Item>
                <Space direction="vertical" align="center" className="w-full">
                  <Button type="primary" htmlType="submit" loading={isLoading || updateIsLoading}>
                    Salvar
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}
