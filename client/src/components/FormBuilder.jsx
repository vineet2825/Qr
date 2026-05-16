import React, { useState } from 'react';
import { Plus, Trash2, Save, Type, List, File } from 'lucide-react';
import API from '../api';
import toast from 'react-hot-toast';

const FormBuilder = ({ items, onCreated }) => {
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [fields, setFields] = useState([]);

  const addField = (type) => {
    const newField = {
      label: 'New Field',
      type: type,
      required: false,
      options: type === 'select' ? ['Option 1'] : []
    };
    setFields([...fields, newField]);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const handleSubmit = async () => {
    if (!formTitle || !selectedItem) {
      toast.error('Title and Item are required');
      return;
    }
    try {
      await API.post('/forms', {
        title: formTitle,
        description: formDesc,
        associatedItem: selectedItem,
        fields
      });
      toast.success('Form created successfully!');
      setFormTitle('');
      setFormDesc('');
      setFields([]);
      onCreated();
    } catch (error) {
      toast.error('Failed to create form');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Configuration */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="text-xl font-bold mb-4">Form Configuration</h3>
        <div>
          <label className="text-sm text-slate-400">Form Title</label>
          <input 
            type="text" 
            className="input-field" 
            value={formTitle} 
            onChange={(e) => setFormTitle(e.target.value)} 
          />
        </div>
        <div>
          <label className="text-sm text-slate-400">Description</label>
          <textarea 
            className="input-field" 
            value={formDesc} 
            onChange={(e) => setFormDesc(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label className="text-sm text-slate-400">Associate with Item</label>
          <select 
            className="input-field bg-slate-800" 
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            <option value="">Select an Item</option>
            {items.map(item => (
              <option key={item._id} value={item._id}>{item.name} ({item.modelNumber})</option>
            ))}
          </select>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <p className="text-sm font-medium mb-3">Add Fields</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => addField('text')} className="glass p-2 rounded-lg text-sm flex items-center gap-2 justify-center">
              <Type className="w-4 h-4" /> Text
            </button>
            <button onClick={() => addField('number')} className="glass p-2 rounded-lg text-sm flex items-center gap-2 justify-center">
              <Type className="w-4 h-4" /> Number
            </button>
            <button onClick={() => addField('select')} className="glass p-2 rounded-lg text-sm flex items-center gap-2 justify-center">
              <List className="w-4 h-4" /> Select
            </button>
            <button onClick={() => addField('file')} className="glass p-2 rounded-lg text-sm flex items-center gap-2 justify-center">
              <File className="w-4 h-4" /> File
            </button>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Save Dynamic Form
        </button>
      </div>

      {/* Preview / Field Editor */}
      <div className="glass-card p-6 rounded-2xl bg-white/5">
        <h3 className="text-xl font-bold mb-4">Field Editor</h3>
        {fields.length === 0 ? (
          <div className="text-center py-20 text-slate-500 italic border-2 border-dashed border-slate-800 rounded-xl">
            Add some fields to get started
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, idx) => (
              <div key={idx} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 relative group">
                <button 
                  onClick={() => removeField(idx)}
                  className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500">Label</label>
                    <input 
                      type="text" 
                      className="bg-transparent border-b border-slate-600 focus:border-primary-500 outline-none w-full text-sm" 
                      value={field.label}
                      onChange={(e) => updateField(idx, 'label', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500">Type</label>
                    <div className="text-xs text-primary-400 font-medium">{field.type}</div>
                  </div>
                </div>
                {field.type === 'select' && (
                  <div className="mt-2">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Options (comma separated)</label>
                    <input 
                      type="text" 
                      className="bg-transparent border-b border-slate-600 focus:border-primary-500 outline-none w-full text-sm" 
                      placeholder="Opt 1, Opt 2"
                      onChange={(e) => updateField(idx, 'options', e.target.value.split(',').map(s => s.trim()))}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
