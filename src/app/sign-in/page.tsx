'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { PiggyBank, CircleDollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

// 使用 CircleDollarSign 作为金币组件
const Coin = ({ id, rotation }: { id: number; rotation: number }) => {
  return (
    <div
      key={id}
      className='absolute coin-fall'
      style={{
        left: '50%', // 居中对齐
        transform: `translateX(-50%) rotate(${rotation}deg)`, // 水平居中并旋转
        zIndex: 10, // 确保金币在小猪下方
      }}>
      <CircleDollarSign className='h-6 w-6 text-black' />
    </div>
  );
};

export default function PiggyInputPage() {
  const [coins, setCoins] = useState<Array<{ id: number; rotation: number }>>(
    []
  );
  const [canDrop, setCanDrop] = useState(true); // 控制是否可以掉落金币
  const cooldownTimeRef = useRef<NodeJS.Timeout | null>(null);
  const COOLDOWN_PERIOD = 800; // 冷却时间，单位毫秒

  // 处理键盘按下事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 只有在可以掉落金币的状态下才处理按键
    if (canDrop) {
      // 为每次按键创建一个新金币
      const newCoin = {
        id: Date.now(),
        rotation: Math.random() * 360,
      };

      setCoins((prev) => [...prev, newCoin]);

      // 设置为不可掉落状态
      setCanDrop(false);

      // 金币触碰到小猪边缘时移除（大约0.4秒后）
      setTimeout(() => {
        setCoins((prev) => prev.filter((coin) => coin.id !== newCoin.id));
      }, 400);

      // 设置冷却时间，冷却结束后才能再次掉落金币
      cooldownTimeRef.current = setTimeout(() => {
        setCanDrop(true);
      }, COOLDOWN_PERIOD);
    }
  };

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (cooldownTimeRef.current) clearTimeout(cooldownTimeRef.current);
    };
  }, []);

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <Card className='w-full max-w-md'>
        <CardContent className='pt-6'>
          <div className='flex flex-col items-center space-y-8'>
            <div className='relative w-full flex justify-center'>
              <div className='relative'>
                {/* 金币容器 - 放在小猪前面，但z-index较低 */}
                <div className='absolute top-0 left-0 w-full h-0'>
                  {coins.map((coin) => (
                    <Coin
                      key={coin.id}
                      id={coin.id}
                      rotation={coin.rotation}
                    />
                  ))}
                </div>
                {/* 小猪 - 放在金币后面，但z-index较高 */}
                <PiggyBank
                  className='h-16 w-16 text-black relative'
                  style={{ zIndex: 20 }}
                />
              </div>
            </div>

            <div className='w-full space-y-2'>
              <h2 className='text-center text-xl font-semibold mb-4'>
                存钱罐输入框
              </h2>
              <p className='text-center text-sm text-gray-500 mb-4'>
                在下方输入框中打字，金币会间隔性地掉落（{COOLDOWN_PERIOD / 1000}
                秒冷却时间）
              </p>
              <Input
                placeholder='在这里输入文字...'
                className='w-full'
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 添加动画样式 */}
      <style
        jsx
        global>{`
        @keyframes coinFall {
          0% {
            top: -20px; /* 从小猪上方开始 */
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 0px; /* 只下落到小猪的顶部边缘 */
            opacity: 0; /* 在接触小猪时淡出 */
          }
        }

        .coin-fall {
          position: absolute;
          animation: coinFall 0.4s ease-in forwards; /* 缩短动画时间 */
        }
      `}</style>
    </div>
  );
}
