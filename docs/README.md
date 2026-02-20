# Docs Index

작성일: 2026-02-20

## 문서 맵

- `docs/PLAN_FRONTEND.md`
  프론트 장기 로드맵(무엇을 어떤 순서로 할지)

- `docs/API_CHECKLIST_FRONTEND.md`
  프론트-백엔드 바인딩 체크리스트(엔드포인트/필드/응답)

- `docs/PROJECT_STRUCTURE.md`
  코드 구조와 아키텍처 설명(온보딩/참고용)

- `docs/TASK_BOARD.md`
  현재 작업 상태 관리(지시/진행/검수)

- `docs/REVIEW_CHECKLIST_FRONTEND.md`
  API 체크리스트 기준 구현 검수 스냅샷 + 릴리즈 전 점검표

## 단일 책임 규칙

1. 진행 상태는 `docs/TASK_BOARD.md`에서만 관리합니다.
2. API 계약은 `docs/API_CHECKLIST_FRONTEND.md`에서만 관리합니다.
3. 로드맵 문서에는 작업 상태를 쓰지 않습니다.
4. 같은 내용이 2개 문서에 겹치면 한쪽은 링크로 대체합니다.

## AI 작업 지시 시 기본 입력

AI에게 작업 지시할 때는 아래 3개를 기본으로 전달합니다.

1. `docs/PLAN_FRONTEND.md`
2. `docs/API_CHECKLIST_FRONTEND.md`
3. `docs/TASK_BOARD.md`

검수/리뷰를 요청할 때는 아래 문서를 추가로 전달합니다.

4. `docs/REVIEW_CHECKLIST_FRONTEND.md`
