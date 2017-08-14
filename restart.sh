#!/bin/sh

checkProcess()
{
    # 检查输入的参数是否有效
    if [ "$1" = "" ];
    then
        return 1
    fi
    #$PROCESS_NUM获取指定进程名的数目，为1返回0，表示正常，不为1返回1，表示有错误，需要重新启动
    PROCESS_NUM=`ps -ef | grep "$1" | grep -v "grep" | wc -l `

    IS_RUNNING_NUM=1
    echo "Current Process num:$PROCESS_NUM"

    if [ $PROCESS_NUM -eq 5 ];
    then
        return 0
    else
        return 1
    fi
}
# 检查Beidou实例是否已经存在
while [ 1 ];
do
    checkProcess "Beidou"
    CheckQQ_RET=$?
    if [ $CheckQQ_RET -eq 1 ];
    then
        killall -9 Beidou
        echo "杀死所有beidou进程"
        exec sudo  ~/build-Beidou-Desktop_Qt_5_8_0_GCC_64bit-Debug/Beidou &
        echo "北斗进程已重启"
    fi

    sleep 1

done
