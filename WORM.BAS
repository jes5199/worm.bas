1 '            The Game of Worm
2 '
3 ' Based on Unix WORM.  Implemented on z-100 by Jan Wolter.
4 ' Set up score file by doing a RUN 10000 before playing.
5 '
6 ' HC()=Head Characters. TC()=Tail Characters.  S=Speed.  Z=Maximum Length.
7 ' E=Flag to allow eating Self.  AP=Probability of Ant  BC(,)=Body Characters.
8 ' AR,AC=Location of Ant.  WR(),WC()=Location of Worm
9 ' SC(),SN$()=Record score and name  SF$=Score file name.
10 DEFINT A-Z
11 Z=1800:SF$="WORM.DAT"
12 DIM WC(Z),WR(Z),WD(Z),SC(5),SN$(5),OC(126)
15 GOSUB 9000:GOSUB 8000: GOSUB 11000
50 A=0: M=1: GOSUB 6000: GOSUB 5000: GOSUB 7000
100 NR=WR(H)+DR:NC=WC(H)+DC:D=SCREEN(NR,NC)
130 LOCATE WR(H),WC(H):PRINT BC$(OD,ND);:LOCATE WR(T),WC(T):PRINT" ";:LOCATE NR,NC:PRINT HC$(ND);
140 WD(H)=ND:H=H+1: IF H>Z THEN H=0
150 T=T+1: IF T>Z THEN T=0
155 IF L>1 THEN LOCATE WR(T),WC(T):PRINT TC$(WD(T));
160 WC(H)=NC:WR(H)=NR
170 IF D=42 THEN A=0:D=INT(8*RND)+9:GOTO 3000
180 IF D<58 AND D>48 THEN D=D-48: GOTO 3000
190 IF (D>32 AND D<107) OR D=124 THEN 2000
290 GOSUB 4000:IF A=0 THEN 100
300 ON INT(RND*4+1) GOTO 310,320,330,340
310 BR = AR-1:BC=AC: GOTO 350
320 BR = AR+1:BC=AC: GOTO 350
330 BC = AC-1:BR=AR: GOTO 350
340 BC = AC+1:BR=AR
350 IF SCREEN(BR,BC)<>32 THEN 100 ELSE LOCATE AR,AC: PRINT" ";:LOCATE BR,BC:PRINT"*";:AR=BR:AC=BC:GOTO 100
1000 FR=INT(RND*23)+2:FC=INT(RND*78)+2:IF SCREEN(FR,FC)<>32 THEN 1000
1005 IF RND<AP! THEN A=1: AR=FR: AC=FC:LOCATE AR,AC:PRINT"*";: RETURN
1010 LOCATE FR,FC:PRINT CHR$( INT(RND*9)+49);:RETURN
2000 IF (NOT E)OR(D=45)OR(D=124)THEN BEEP:GOSUB 7000:IF MX>SC(RC) THEN 8500 ELSE 2500
2005 IF L<3 THEN 290
2010 MR=WR(T):MC=WC(T):L=L-1:T=T+1:IF T>Z THEN T=0
2020 IF ((MR<>NR)OR(MC<>NC))AND(L>2) THEN LOCATE MR,MC:PRINT" ";:GOTO 2010
2030 GOSUB 7000:GOTO 290
2500 FOR I=1 TO 100: I$=INKEY$: NEXT: IF INKEY$<>"" THEN 2500
2510 GOSUB 12000:GOSUB 3500
2520 LOCATE 12,32:PRINT"Want to play again";
2530 LOCATE 13,37:PRINT"(Y/N)?";
2540 I$=INPUT$(1):IF I$="N" OR I$="n" THEN CLS:END
2550 IF I$="y" OR I$="Y" THEN RUN ELSE BEEP: GOTO 2540
3000 L=L+D: FOR J=1 TO D: T=T-1: IF T<0 THEN T=Z
3010 WR(T)=1:WC(T)=18:WD(T)=5:NEXT:GOSUB 7000:GOSUB 1000: GOTO 290
3500 LOCATE 11,25:PRINT"+-----------------------------+";
3510 LOCATE 12,25:PRINT"|                             |";
3520 LOCATE 13,25:PRINT"|                             |";
3530 LOCATE 14,25:PRINT"+-----------------------------+";
3540 RETURN
4000 OD=ND:FOR J= 1 TO S: I$=INKEY$: IF I$<>""THEN 4500 ELSE NEXT: RETURN
4500 D=ASC(I$): IF D<32 THEN 4550 ELSE IF D<96 THEN 4590
4510 IF I$="h" THEN DR=0:DC=-1:ND=3:RETURN
4520 IF I$="k" THEN DR=-1:DC=0:ND=1:RETURN
4530 IF I$="j" THEN DR=1:DC=0:ND=2:RETURN
4540 IF I$="l" THEN DR=0:DC=1:ND=4:RETURN
4545 RETURN
4550 IF D=29 THEN DR=0:DC=-1:ND=3:RETURN
4560 IF D=28 THEN DR=0:DC=1:ND=4:RETURN
4570 IF D=30 THEN DR=-1:DC=0:ND=1:RETURN
4580 IF D=31 THEN DR=1:DC=0:ND=2:RETURN
4585 RETURN
4590 IF I$="4" THEN DR=0:DC=-1:ND=3:RETURN
4600 IF I$="8" THEN DR=-1:DC=0:ND=1:RETURN
4610 IF I$="2" THEN DR=1:DC=0:ND=2:RETURN
4620 IF I$="6" THEN DR=0:DC=1:ND=4:RETURN
4630 RETURN
5000 T=0:L=6:MX=L:H=T+L-1:ND=4:OD=4
5010 FOR I=T TO H:WR(I)=12:WC(I)=6+I:WD(I)=ND:NEXT
5020 LOCATE 12,6:PRINT TC$(ND);STRING$(L-2,BC$(ND,ND));HC$(ND);
5022 GOSUB 1000: GOSUB 7000
5025 I$=INKEY$
5030 I$=INKEY$:IF I$="" THEN I=RND: GOTO 5030: ELSE 4500
6000 CLS:PRINT:PRINT "+";STRING$(78,"-");"+";:LOCATE 25,1:PRINT "+";STRING$(78,"-");"+";
6010 FOR I=3 TO 24:LOCATE I,1:PRINT"|";:LOCATE,80:PRINT"|";:NEXT
6020 LOCATE 1,1:PRINT"THE GAME OF WORM";
6030 RETURN
7000 IF L>MX THEN MX=L
7010 LOCATE 1,30:PRINT"SCORE =";L;:IF E THEN PRINT"      MAX = ";MX;
7020 PRINT"   REC =";SC(RC);"   ";SN$(RC);"  ";
7030 RETURN
8000 GOSUB 10000:FOR I=1 TO 5: INPUT #1,SC(I),SN$(I):NEXT:CLOSE:RETURN
8500 SC(RC)=MX:GOSUB 12000:GOSUB 3500:LOCATE 12,29:PRINT"You've Set a new Record!":LOCATE 13,28:PRINT"Enter your initials: ";: GOSUB 9500: SN$(RC)=N$
8510 SC(RC)=MX: OPEN "O",1,SF$: FOR I=1 TO 5 :PRINT #1,SC(I),SN$(I):NEXT:CLOSE:GOTO 2500
9000 CLS: PRINT"The Game of Worm"
9001 PRINT "Select the Version You Want to Play:":PRINT
9002 PRINT"       (0) Print Help":PRINT "       (1) Original Worm"
9003 PRINT"       (2) Improved Worm":PRINT "       (3) At the Ant Farm"
9004 PRINT"       (4) SuperWorm":PRINT "       (5) SuperWorm At the Ant Farm"
9005 I$=INKEY$
9010 I$=INKEY$:IF I$="" THEN I=RND:GOTO 9010
9020 IF I$="1" THEN E=0: AP!=0!: S=50: RC=1: RETURN
9030 IF I$="2" THEN E=-1: AP!=.1: S=30: RC=2: RETURN
9040 IF I$="3" THEN E=-1: AP!=1!: S=40: RC=3: RETURN
9050 IF I$="4" THEN E=-1: AP!=.03: S=1: RC=4: RETURN
9060 IF I$="5" THEN E=-1: AP!=1!: S=1: RC=5: RETURN
9066 IF I$="0" THEN GOSUB 30000: GOTO 9000
9070 BEEP: GOTO 9010
9500 R=CSRLIN:C=POS(0):N=0:PRINT"....";:N$(1)=".":N$(2)=" ":N$(3)=" ":N$(4)=" "
9510 I$=INKEY$: IF I$=""THEN 9510
9520 IF ASC(I$)=8 THEN IF N=0 THEN 9510 ELSE N=N-1:C=C-1:GOTO 9510
9530 IF N=4 OR ASC(I$)=13 THEN N$=N$(0)+N$(1)+N$(2):RETURN
9540 IF I$<" " OR I$>"z" THEN 9510
9550 C=C+1:N=N+1:IF I$>="a" AND I$<="z" THEN I$=CHR$(ASC(I$)-32)
9560 LOCATE R,C-1:PRINT I$;:N$(N-1)=I$:GOTO 9510
9999 ' set up a new score file, with all previous scores zeroed.
10000 ON ERROR GOTO 10005: OPEN"I",1,SF$
10002 ON ERROR GOTO 0: RETURN
10005 FOR I=1 TO 5:SN$(I)="...":SC(I)=0:NEXT
10010 CLOSE:OPEN "O",1,SF$: FOR I=1 TO 5 :PRINT #1,SC(I),SN$(I):NEXT
10020 CLOSE:OPEN"I",1,SF$:RESUME 10002
11000 DEF SEG = 0 : DEF SEG = PEEK(&H3FF)*256 + PEEK(&H3FE)
11010 FO = PEEK(&H70)*256 + PEEK(&H6F): FS = PEEK(&H72)*256 + PEEK(&H71)
11030 RESTORE: DEF SEG = FS : P = FO + 9*&H41
11040 FOR I= 1 TO 126:OC(I)=PEEK(P):READ Q: POKE P,Q: P=P+1: NEXT
11060 DIM BC$(4,4),HC$(4),TC$(5)
11070 BC$(1,1)="a": BC$(1,2)="a": BC$(1,3)="d": BC$(1,4)="c"
11080 BC$(2,1)="a": BC$(2,2)="a": BC$(2,3)="f": BC$(2,4)="e"
11090 BC$(3,1)="e": BC$(3,2)="c": BC$(3,3)="b": BC$(3,4)="b"
11100 BC$(4,1)="f": BC$(4,2)="d": BC$(4,3)="b": BC$(4,4)="b"
11110 HC$(1)="h": HC$(2)="g": HC$(3)="j": HC$(4)="i"
11120 TC$(1)="l": TC$(2)="k": TC$(3)="n": TC$(4)="m": TC$(5)=" "
11130 RETURN
12000 DEF SEG = 0 : DEF SEG = PEEK(&H3FF)*256 + PEEK(&H3FE)
12010 FO = PEEK(&H70)*256 + PEEK(&H6F): FS = PEEK(&H72)*256 + PEEK(&H71)
12030 DEF SEG = FS : P = FO + 9*&H41
12040 FOR I= 1 TO 126:POKE P,OC(I): P=P+1: NEXT
12050 RETURN
20000 ' straight ( vertical, horizontal)
20010 DATA &H5E,&H6E,&H7E,&H5E,&H6E,&H7E,&H5E,&H6E,&H7E
20020 DATA &H00,&H00,&H00,&HBB,&HEF,&HFF,&H00,&H00,&H00
20025 ' curves (bottom/right, bottom/left, top/right, top/left)
20030 DATA &H00,&H00,&H00,&H0B,&H3F,&H7F,&H5F,&H6E,&H7E
20040 DATA &H00,&H00,&H00,&HB0,&HEC,&HFE,&HDE,&H6E,&H7E
20050 DATA &H5E,&H6E,&H7F,&H7B,&H3F,&H0F,&H00,&H00,&H00
20060 DATA &H5E,&H6E,&HFE,&HBE,&HFC,&HF0,&H00,&H00,&H00
20065 ' heads (from top, bottom, left, right)
20070 DATA &H5E,&H6E,&H7E,&H76,&HF9,&H89,&HF9,&H78,&H00
20080 DATA &H00,&H78,&HF9,&H89,&HF9,&H76,&H7E,&H6E,&H7E
20090 DATA &H00,&H00,&HFC,&HE7,&H7F,&H80,&HFC,&H00,&H00
20100 DATA &H00,&H00,&H3F,&HE7,&HFE,&H01,&H3F,&H00,&H00
20105 ' tails (to bottom, top, left, right)
20110 DATA &H10,&H10,&H18,&H18,&H38,&H38,&H3C,&H3C,&H7C
20120 DATA &H3E,&H3C,&H3C,&H1C,&H1C,&H18,&H18,&H08,&H08
20130 DATA &H00,&H00,&H00,&H07,&HFF,&H01,&H00,&H00,&H00
20140 DATA &H00,&H00,&H00,&HC0,&H7F,&H80,&H00,&H00,&H00
30000 CLS:PRINT"   The object of the game of worm is to guide the worm to eat as much food"
30010 PRINT"as possible.  Food appears either in the form of numeric digits (1 to 9)"
30020 PRINT"or as ants (*).  Besides adding to your score, eating food makes you grow"
30030 PRINT"longer.  It is fatal to run into the electric fence surrounding the field"
30040 PRINT"and biting your tail has disasterous side affects.  You steer with any"
30050 PRINT"of the following sets of direction keys:"
30060 PRINT
30065 PRINT"             direction     arrow keys    keypad   unix-keys"
30066 PRINT"           ---------------------------------------------------"
30070 PRINT"                left:      left-arrow       4       h"
30080 PRINT"               right:      right-arrow      6       l"
30090 PRINT"                  up:       up-arrow        8       k"
30100 PRINT"                down:      down-arrow       2       j"
30110 PRINT
30120 PRINT"A few things to be careful of:"
30125 PRINT
30130 PRINT"  *  Don't use the CTRL-C key to exit.  This leaves the character set messed"
30140 PRINT"     up.  If you do hit break, type GOSUB 12000 immediately (in caps), or"
30150 PRINT"     reset the computer."
30155 PRINT
30160 PRINT"  *  Worm creates a score file on the logged disk.  The filename can"
30170 PRINT"     be set in line 11.  If you have a hard disk, you will want to change"
30180 PRINT"     it to ""F:WORM.SCR""."
30190 LOCATE 25,25:PRINT"< Hit any key to continue >":I$=INPUT$(1)
30200 RETURN
30300 END
