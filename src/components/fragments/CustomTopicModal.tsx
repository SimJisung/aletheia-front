'use client';

import { useState, useEffect, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TOPIC_PRESETS } from '@/types';

interface CustomTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (topic: string) => void;
  existingTopics: string[];
}

const MIN_LENGTH = 1;
const MAX_LENGTH = 20;

export function CustomTopicModal({
  isOpen,
  onClose,
  onAdd,
  existingTopics,
}: CustomTopicModalProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue('');
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const validate = (input: string): string | null => {
    const trimmed = input.trim();
    if (trimmed.length < MIN_LENGTH) {
      return '주제를 입력해주세요.';
    }
    if (trimmed.length > MAX_LENGTH) {
      return `주제는 ${MAX_LENGTH}자 이하로 입력해주세요.`;
    }
    if (trimmed.includes(',')) {
      return '쉼표는 사용할 수 없습니다.';
    }
    if (existingTopics.includes(trimmed)) {
      return '이미 추가된 주제입니다.';
    }
    if (TOPIC_PRESETS.some((p) => p.id === trimmed || p.label === trimmed)) {
      return '기본 주제와 동일한 이름은 사용할 수 없습니다.';
    }
    return null;
  };

  const handleSubmit = () => {
    const validationError = validate(value);
    if (validationError) {
      setError(validationError);
      return;
    }
    onAdd(value.trim());
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="주제 추가" size="sm">
      <div className="space-y-4">
        <div>
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="주제를 입력하세요"
            maxLength={MAX_LENGTH + 5}
            error={error || undefined}
            aria-label="커스텀 주제"
            aria-describedby={error ? 'topic-error' : undefined}
          />
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {value.trim().length}/{MAX_LENGTH}자
          </p>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} className="flex-1">
            취소
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={handleSubmit} className="flex-1">
            추가
          </Button>
        </div>
      </div>
    </Modal>
  );
}
