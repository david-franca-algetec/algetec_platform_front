import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, InputRef, Space } from 'antd';
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import { toLower } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';

interface ISearchColumn<K> {
  index: keyof K;
  title: string;
  includes?: boolean;
  onSearch?: (text: string) => void;
  dataValue?: string;
}

export function SearchColumn<T>({ index, title, includes, onSearch, dataValue }: ISearchColumn<T>) {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: keyof T) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex as string);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: keyof T, dataTitle: string, isIncludes?: boolean): ColumnType<T> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()} aria-hidden="true">
        <Input
          ref={searchInput}
          placeholder={`Pesquisar ${dataTitle}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
          >
            Pesquisar
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Limpar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex as string);
            }}
          >
            Aplicar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Fechar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      !isIncludes
        ? (record[dataIndex] as string).toString().toLowerCase() === value
        : toLower((record[dataIndex] as string).toString()).includes(value as string),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#fff', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  useEffect(() => {
    if (dataValue) {
      setSearchText(dataValue);
    }
  }, [dataValue]);

  useEffect(() => {
    if (onSearch) {
      onSearch(searchText);
    }
  }, [searchText]);

  return getColumnSearchProps(index, title, includes);
}
