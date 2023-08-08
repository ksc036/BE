process=$(sudo lsof -i :4060 | awk 'NR==2{print $2}')

if [ -n "$process" ]; then
    echo "포트 4060을 사용중인 프로세스($process)를 종료합니다."    
    sudo kill "$process"
else
    echo "아무것도없음"
fi