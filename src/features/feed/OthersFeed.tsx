import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import dayjs from 'dayjs';

import { IconChevronRight } from '@/public/svgs';
import { Spacing } from '@/shared/components';
import { useRoom } from '@/shared/store/room';
import { emojiType, EmojiInfoType } from '@/shared/types/feed';
import { convertNumberToCurrency } from '@/shared/utils/currency';
import { getKoreanDate } from '@/shared/utils/date';
import { createEmojiInfo } from '@/shared/utils/emoji';

import { Emoji } from '../emoji/Emoji';
import { useDeleteEmoji, useUpdateEmoji } from '../emoji/queries';

type OthersFeedProps = {
  recordId: number;
  price: number;
  currentCharge: number;
  nickname: string;
  title: string;
  content: string;
  recordDate: string;
  profileImgUrl: string;
  emojiInfo: EmojiInfoType;
  recordImgUrl?: string;
  onClickFeed: (recordId: number) => void;
};

type TEmoji = {
  type: emojiType;
  count: number;
  selected: boolean;
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

  const DEFAULT_EMOJIS = [
    createEmojiInfo('CRAZY', emojiInfo.CRAZY, emojiInfo.selected),
    createEmojiInfo('REGRETFUL', emojiInfo.REGRETFUL, emojiInfo.selected),
    createEmojiInfo('WELLDONE', emojiInfo.WELLDONE, emojiInfo.selected),
    createEmojiInfo('comment', emojiInfo.comment, emojiInfo.selected),
  ];

  const challengeId = useRoom((state) => state.challengeId);

  const [emojis, setEmojis] = useState<TEmoji[]>(DEFAULT_EMOJIS);
  const [prevEmojis, setPrevEmojis] = useState<TEmoji[]>(DEFAULT_EMOJIS);

  const updateEmoji = useUpdateEmoji();
  const deleteEmoji = useDeleteEmoji();

  // TODO: 서버 호출 로직까지 작성한 이후에 리펙토링
  const handleClickEmoji = (clickedEmojiType: emojiType) => {
    if (clickedEmojiType === 'comment') {
      return;
    }

    setPrevEmojis(emojis);

    const clickedEmoji = emojis.find(
      (emoji) => emoji.type === clickedEmojiType,
    );
    const isClickedEmojiSelectedBefore = clickedEmoji?.selected;

    if (isClickedEmojiSelectedBefore) {
      setEmojis((prev) =>
        prev.map((emoji) => {
          if (emoji.type === clickedEmojiType) {
            deleteEmoji.mutate({
              recordId,
              type: clickedEmojiType,
            });
            return {
              ...emoji,
              selected: false,
              count: emoji.count - 1,
            };
          }
          return emoji;
        }),
      );
      return;
    }

    setEmojis((prev) =>
      prev.map((emoji) => {
        if (emoji.type === clickedEmojiType) {
          updateEmoji.mutate({
            recordId,
            type: clickedEmojiType,
          });
          return {
            ...emoji,
            selected: true,
            count: emoji.count + 1,
          };
        }
        if (emoji.selected) {
          return {
            ...emoji,
            selected: false,
            count: emoji.count - 1,
          };
        }
        return {
          ...emoji,
          selected: false,
        };
      }),
    );
  };

  useEffect(() => {
    if (!updateEmoji.isError) {
      return;
    }

    setEmojis(prevEmojis);
  }, [updateEmoji.isError]);

  useEffect(() => {
    if (!deleteEmoji.isError) {
      return;
    }

    setEmojis(prevEmojis);
  }, [deleteEmoji.isError]);

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
      <div className="relative">
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
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
            <Link href={`/my-poor-room/${challengeId}/${recordId}`}>
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
            </Link>
            <Spacing height={6} />
          </>
        )}
        <div className="relative">
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <Link href={`/my-poor-room/${challengeId}/${recordId}`}>
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
          </Link>
        </div>
        <Spacing height={8} />
        <div className="flex gap-1">
          {emojis.map(({ type, count }, index) => {
            return (
              <Emoji
                key={index}
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
    </li>
  );
};

export { OthersFeed };