import Image from 'next/image';
import { useState } from 'react';

import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import { IconChevronRight } from '@/public/svgs';
import { Spacing } from '@/shared/components';
import { convertNumberToCurrency } from '@/shared/utils/currency';
import { TEmojiInfo } from '@/types/feed';

import { Emoji, reactType } from '../emoji/Emoji';

type OthersFeedProps = {
  recordId: number;
  price: number;
  currentCharge: number;
  nickname: string;
  title: string;
  content: string;
  recordDate: string;
  profileImgUrl: string;
  emojiInfo: TEmojiInfo;
  recordImgUrl?: string;
  onClickFeed: (recordId: number) => void;
};

const OthersFeed = ({
  recordId,
  price,
  currentCharge,
  profileImgUrl,
  nickname,
  title,
  content,
  recordDate,
  emojiInfo,
  recordImgUrl,
  onClickFeed,
}: OthersFeedProps) => {
  const convertedDate = dayjs(recordDate).format('a hh:mm');
  const convertedCurrentCharge = convertNumberToCurrency({
    value: currentCharge,
    unitOfCurrency: '원',
  });
  const convertedPrice = convertNumberToCurrency({
    value: price,
    unitOfCurrency: '원',
  });

  const [emojis, setEmojis] = useState<
    {
      type: reactType;
      count: number;
      selected: boolean;
    }[]
  >([
    {
      type: 'CRAZY',
      count: emojiInfo.CRAZY,
      selected: emojiInfo.selectedEmoji === 'CRAZY',
    },
    {
      type: 'REGRETFUL',
      count: emojiInfo.REGRETFUL,
      selected: emojiInfo.selectedEmoji === 'REGRETFUL',
    },
    {
      type: 'WELLDONE',
      count: emojiInfo.WELLDONE,
      selected: emojiInfo.selectedEmoji === 'WELLDONE',
    },
    {
      type: 'comment',
      count: emojiInfo.comment,
      selected: emojiInfo.selectedEmoji === 'comment',
    },
  ]);

  const getKoreanDate = (date: string) => {
    if (date.includes('am')) {
      return date.replace('am', '오전');
    }
    if (date.includes('pm')) {
      return date.replace('pm', '오후');
    }
    return '';
  };

  // TODO: 서버 데이터 호출 이후에 리턴 값을 emoji로 set하는 방식 ?
  const handleClickEmoji = (clickedEmojiType: reactType) => {
    // console.log(`clicked emoji ${clickedEmojiType}`);
  };

  return (
    <li className="flex gap-[10px]">
      <div className="relative h-[2.625rem] w-[2.625rem] rounded-[0.625rem] object-cover ">
        <Image
          src={profileImgUrl}
          alt=""
          fill
          sizes="(max-width: 600px) 10vw"
        />
      </div>
      <div>
        <div className="flex items-center gap-[4px]">
          <p className="font-body-regular-sm w-40 truncate font-[600] text-black">
            {nickname}
          </p>
          <p className="font-caption-medium-md text-gray-50 ">
            {convertedCurrentCharge}
          </p>
        </div>
        <Spacing height={8} />
        {recordImgUrl && (
          <>
            <div
              className="relative h-[9.125rem] w-[13.75rem] overflow-hidden rounded-md"
              onClick={() => onClickFeed(recordId)}
            >
              <Image
                src={recordImgUrl}
                alt="피드 이미지"
                fill
                className="object-cover"
                sizes="(max-width: 600px) 60vw"
              />
            </div>
            <Spacing height={6} />
          </>
        )}
        <div className="relative">
          <div
            className="w-[13.75rem] rounded-md bg-white p-2.5"
            onClick={() => onClickFeed(recordId)}
          >
            <div className="font-body-regular-sm flex items-center justify-between font-[600] text-gray-70">
              <div>
                <p className="w-[6.75rem] truncate">{title}</p>
              </div>
              <div className="flex items-center gap-1.5 ">
                <p>{convertedPrice}</p>
                <IconChevronRight className="h-2 w-1 fill-none" />
              </div>
            </div>
            <p className="font-caption-medium-md truncate text-gray-50">
              {content}
            </p>
          </div>
          <Spacing height={8} />
          <div className="flex gap-1">
            {emojis.map(({ type, count }) => {
              return (
                <Emoji
                  key={uuidv4()}
                  type={type}
                  count={count}
                  onClickEmoji={handleClickEmoji}
                />
              );
            })}
          </div>
          <div className="absolute bottom-0 left-[14rem] flex">
            <p className="font-caption-medium-sm shrink-0 text-gray-50">
              {getKoreanDate(convertedDate)}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
};

export { OthersFeed };
