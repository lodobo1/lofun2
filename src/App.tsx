import { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import { Users, Mail } from 'lucide-react';
import emailjs from '@emailjs/browser';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4F46E5', // Indigo-600
    },
    background: {
      default: '#F3F4F6', // Gray-100
    },
  },
  typography: {
    fontFamily: '"Pretendard", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 16,
  }
});

function App() {
  const [supportCount, setSupportCount] = useState(0);
  const [hasSupported, setHasSupported] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // 테스트를 위해 목표 인원 1명으로 설정
  const targetCount = 1;
  const targetEmail = "lodobo383@gmail.com";

  const handleSupport = async () => {
    if (hasSupported || isSending) return;
    
    setIsSending(true);
    const newCount = supportCount + 1;

    try {
      if (newCount >= targetCount) {
        // 프론트엔드 환경에서 이메일 자동 발송
        // 실제 발송을 위해서는 https://www.emailjs.com/ 에 가입 후
        // 아래 키들을 .env 파일이나 여기에 직접 입력해야 합니다.
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";

        const templateParams = {
          to_email: targetEmail,
          subject: "새로운 제안이 목표 인원에 도달했습니다!",
          message: `안녕하세요,\n\n제안해주신 프로젝트가 목표 인원(${targetCount}명)을 달성했습니다!\n\n지원자 수: ${newCount}명\n\n이메일 발송 테스트 완료.`,
        };

        if (serviceId !== "YOUR_SERVICE_ID") {
          await emailjs.send(serviceId, templateId, templateParams, publicKey);
          console.log("이메일이 성공적으로 전송되었습니다!");
        } else {
          console.log("[테스트 모드] EmailJS 키가 설정되지 않아 가상으로 이메일 발송을 성공 처리합니다.", templateParams);
        }
      }
      
      setSupportCount(newCount);
      setHasSupported(true);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("이메일 발송에 실패했습니다:", error);
      alert("이메일 발송 중 오류가 발생했습니다.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
        <Card sx={{ width: '100%', boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" justifyContent="center" mb={3}>
              <Box sx={{ 
                bgcolor: 'primary.light', 
                color: 'primary.contrastText', 
                p: 2, 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={32} />
              </Box>
            </Box>
            
            <Typography variant="h5" component="h1" align="center" fontWeight="bold" gutterBottom>
              소비자 수요 기반 제안서
            </Typography>
            
            <Typography variant="body1" color="text.secondary" align="center" paragraph>
              우리가 원하는 제품/서비스가 있다면 지지해주세요. 일정 인원(테스트: 1명)이 모이면 제안자에게 알림 메일이 발송됩니다.
            </Typography>

            <Box mt={4} mb={2}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary" fontWeight="bold">
                  모인 인원
                </Typography>
                <Typography variant="body2" color="primary" fontWeight="bold">
                  {supportCount} / {targetCount} 명
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min((supportCount / targetCount) * 100, 100)} 
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
          </CardContent>
          
          <CardActions sx={{ p: 4, pt: 0 }}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large"
              onClick={handleSupport}
              disabled={hasSupported || isSending}
              startIcon={hasSupported ? <Mail size={20} /> : <Users size={20} />}
              sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
            >
              {isSending ? '발송 중...' : hasSupported ? '지지 완료 및 자동 발송됨' : '나도 지지하기'}
            </Button>
          </CardActions>
        </Card>
      </Container>
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          지지가 완료되었습니다! 이메일이 백그라운드에서 자동 발송되었습니다.
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
