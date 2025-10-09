---
sidebar_position: 14
---

# React Patterns - use Funnel

- [React Patterns - use Funnel](#react-patterns---use-funnel)
  - [@use-funnel](#use-funnel)

## @use-funnel

github : https://github.com/toss/use-funnel  
- 토스에서 만든 라이브러리  
- 퍼널 관리에 특화된 추상화된 라이브러리  
  - 1.퍼널 step 관리  
  - 2.각 퍼널별 상태관리 결합  
  - 3.history 관리  

참고
- https://toss.tech/article/use-funnel-2  


📌 예제 코드  
```jsx
/** @jsxImportSource react */
import { useFunnel } from '@use-funnel/react-router-dom';
import { useState } from 'react';

// Mock API - 이메일 검증
const validateEmailAPI = async (email: string): Promise<{ valid: boolean; message?: string }> => {
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!email.endsWith('@gmail.com')) {
    return {
      valid: false,
      message: 'Gmail 계정만 사용 가능합니다. (@gmail.com)',
    };
  }

  return { valid: true };
};

// Type definitions - clearly define the context required for each step
type FunnelContext = {
  emailInput: { email?: string; password?: string };
  passwordInput: { email: string; password?: string };
  selectInfoType: { email: string; password: string; infoType?: 'STUDENT' | 'EMPLOYEE' };
  confirmSelection: { email: string; password: string; infoType: 'STUDENT' | 'EMPLOYEE' };
  studentInfo: { email: string; password: string; infoType: 'STUDENT'; school?: string };
  employeeInfo: { email: string; password: string; infoType: 'EMPLOYEE'; company?: string };
  complete:
    | { email: string; password: string; infoType: 'STUDENT'; school: string }
    | { email: string; password: string; infoType: 'EMPLOYEE'; company: string };
};

interface EmailInputProps {
  onNext: (email: string) => void;
}

const EmailInput = ({ onNext }: EmailInputProps) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      return;
    }

    setError(null);
    setIsValidating(true);

    try {
      const result = await validateEmailAPI(email);

      if (result.valid) {
        onNext(email);
      } else {
        setError(result.message || '유효하지 않은 이메일입니다.');
      }
    } catch (err) {
      setError('이메일 검증 중 오류가 발생했습니다.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Enter your email</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={e => {
            setEmail(e.target.value);
            setError(null); // 입력 시 에러 초기화
          }}
          placeholder="Enter your email"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: error ? '2px solid #dc3545' : '1px solid #ccc',
            borderRadius: '4px',
            outline: error ? 'none' : undefined,
          }}
          required
          disabled={isValidating}
        />
        {error && (
          <div
            style={{
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              color: '#721c24',
              fontSize: '14px',
            }}
          >
            ⚠️ {error}
          </div>
        )}
        <button
          type="submit"
          disabled={isValidating}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: isValidating ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isValidating ? 'not-allowed' : 'pointer',
            opacity: isValidating ? 0.7 : 1,
          }}
        >
          {isValidating ? '검증 중...' : 'Next'}
        </button>
      </form>
      <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
        <p style={{ margin: 0, fontSize: '13px', color: '#004085' }}>💡 힌트: @gmail.com 이메일만 허용됩니다.</p>
      </div>
    </div>
  );
};

interface PasswordInputProps {
  email: string;
  onNext: (password: string) => void;
}

const PasswordInput = ({ email, onNext }: PasswordInputProps) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onNext(password);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Enter your password</h2>
      <p style={{ color: '#6c757d', fontSize: '14px' }}>Email: {email}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter your password"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
          required
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Next
        </button>
      </form>
    </div>
  );
};

interface InfoTypeSelectProps {
  onSelectStudent: () => void;
  onSelectEmployee: () => void;
}

const InfoTypeSelect = ({ onSelectStudent, onSelectEmployee }: InfoTypeSelectProps) => {
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Select additional information</h2>
      <p style={{ color: '#6c757d', marginBottom: '20px' }}>What information would you like to enter?</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          onClick={onSelectStudent}
          style={{
            padding: '15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          🎓 Student Information
        </button>
        <button
          onClick={onSelectEmployee}
          style={{
            padding: '15px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          💼 Employee Information
        </button>
      </div>
    </div>
  );
};

interface ConfirmSelectionOverlayProps {
  infoType: 'STUDENT' | 'EMPLOYEE';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmSelectionOverlay = ({ infoType, onConfirm, onCancel }: ConfirmSelectionOverlayProps) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ marginTop: 0 }}>선택 확인</h2>
        <p style={{ color: '#6c757d', fontSize: '16px' }}>
          {infoType === 'STUDENT' ? '🎓 학생 정보' : '💼 직장인 정보'}를 입력하시겠습니까?
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: infoType === 'STUDENT' ? '#28a745' : '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

interface SchoolInputProps {
  onNext: (school: string) => void;
}

const SchoolInput = ({ onNext }: SchoolInputProps) => {
  const [school, setSchool] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (school.trim()) {
      onNext(school);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>🎓 Enter school information</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={school}
          onChange={e => setSchool(e.target.value)}
          placeholder="Enter school name"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
          required
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Complete
        </button>
      </form>
    </div>
  );
};

interface CompanyInputProps {
  onNext: (company: string) => void;
}

const CompanyInput = ({ onNext }: CompanyInputProps) => {
  const [company, setCompany] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (company.trim()) {
      onNext(company);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>💼 Enter company information</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={company}
          onChange={e => setCompany(e.target.value)}
          placeholder="Enter company name"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
          required
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Complete
        </button>
      </form>
    </div>
  );
};

interface ConfirmStudentProps {
  email: string;
  password: string;
  school: string;
}

const ConfirmStudent = ({ email, password, school }: ConfirmStudentProps) => {
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>🎉 Student information completed!</h2>
      <div
        style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          marginTop: '20px',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Your information</h3>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Password:</strong> {'*'.repeat(password.length)}
        </p>
        <p>
          <strong>Type:</strong> 🎓 Student
        </p>
        <p>
          <strong>School:</strong> {school}
        </p>
      </div>
      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          textAlign: 'center',
          color: '#155724',
        }}
      >
        <strong>✅ All information has been successfully submitted!</strong>
      </div>
    </div>
  );
};

interface ConfirmEmployeeProps {
  email: string;
  password: string;
  company: string;
}

const ConfirmEmployee = ({ email, password, company }: ConfirmEmployeeProps) => {
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>🎉 Employee information completed!</h2>
      <div
        style={{
          padding: '20px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          marginTop: '20px',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Your information</h3>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Password:</strong> {'*'.repeat(password.length)}
        </p>
        <p>
          <strong>Type:</strong> 💼 Employee
        </p>
        <p>
          <strong>Company:</strong> {company}
        </p>
      </div>
      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          borderRadius: '4px',
          textAlign: 'center',
          color: '#0c5460',
        }}
      >
        <strong>✅ All information has been successfully submitted!</strong>
      </div>
    </div>
  );
};

function MyFunnelApp() {
  const funnel = useFunnel<FunnelContext>({
    id: 'my-funnel-app',
    initial: {
      step: 'emailInput',
      context: {},
    },
  });

  return (
    <funnel.Render
      emailInput={funnel.Render.with({
        events: {
          submitEmail: (email: string, { history }: any) => history.push('passwordInput', { email }),
        },
        render({ dispatch }: any) {
          return <EmailInput onNext={email => dispatch('submitEmail', email)} />;
        },
      })}
      passwordInput={funnel.Render.with({
        events: {
          submitPassword: (password: string, { context, history }: any) =>
            history.push('selectInfoType', { ...context, password }),
        },
        render({ context, dispatch }: any) {
          return <PasswordInput email={context.email} onNext={password => dispatch('submitPassword', password)} />;
        },
      })}
      selectInfoType={funnel.Render.with({
        events: {
          selectStudent: (_: any, { history }: any) => history.push('confirmSelection', { infoType: 'STUDENT' }),
          selectEmployee: (_: any, { history }: any) => history.push('confirmSelection', { infoType: 'EMPLOYEE' }),
        },
        render({ dispatch }: any) {
          return (
            <InfoTypeSelect
              onSelectStudent={() => dispatch('selectStudent')}
              onSelectEmployee={() => dispatch('selectEmployee')}
            />
          );
        },
      })}
      confirmSelection={funnel.Render.overlay({
        render({ context, history }: any) {
          return (
            <ConfirmSelectionOverlay
              infoType={context.infoType}
              onConfirm={() => history.push(context.infoType === 'STUDENT' ? 'studentInfo' : 'employeeInfo')}
              onCancel={() => history.replace('selectInfoType')}
            />
          );
        },
      })}
      studentInfo={({ history }: any) => (
        <SchoolInput
          onNext={school =>
            history.push('complete', (prev: any) => ({
              ...prev,
              school,
            }))
          }
        />
      )}
      employeeInfo={({ history }: any) => (
        <CompanyInput
          onNext={company =>
            history.push('complete', (prev: any) => ({
              ...prev,
              company,
            }))
          }
        />
      )}
      complete={({ context }: any) =>
        context.infoType === 'STUDENT' ? (
          <ConfirmStudent email={context.email} password={context.password} school={context.school} />
        ) : (
          <ConfirmEmployee email={context.email} password={context.password} company={context.company} />
        )
      }
    />
  );
}

export const FunnelTestPage = () => {
  return (
    <div>
      <div
        style={{
          padding: '10px 20px',
          backgroundColor: '#343a40',
          color: 'white',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ margin: 0 }}>Funnel Test Page</h1>
        <p style={{ margin: '5px 0 0', fontSize: '14px', opacity: 0.8 }}>@use-funnel/react-router-dom example</p>
      </div>
      <MyFunnelApp />
    </div>
  );
};

```