/* ===== 01. 모바일 메뉴 열고 닫기 ===== */
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.site-header nav');
if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}

/* ===== 02. 일정 / 프로그램 팝업 내용 ===== */
// 실제 행사 정보가 확정되면 이 객체의 내용만 수정하면 됩니다.
const modalData = {
  schedule: {
    eyebrow: 'EVENT SCHEDULE / SAMPLE', title: '전체 일정 안내',
    rows: [
      ['11.21 SAT', '11:00 오픈 및 웰컴 안내<br>11:30 콩물 시음 & 브랜드 소개<br>14:00 진주 사투리 미니 퀴즈<br>17:30 마지막 시음 / 18:00 종료'],
      ['11.22 SUN', '11:00 오픈 및 웰컴 안내<br>12:00 콩물 시음 & 브랜드 소개<br>15:00 콩콩 포토타임<br>17:30 마지막 시음 / 18:00 종료']
    ]
  },
  program: {
    eyebrow: 'POP-UP PROGRAM / SAMPLE', title: '전체 프로그램 안내',
    rows: [
      ['01 TASTING', '에나콩콩 콩물의 고소함을 경험하는 시음 프로그램'],
      ['02 STORY', '진주 사투리에서 시작된 브랜드 이야기와 로고 디자인 소개'],
      ['03 PHOTO', '브랜드 비주얼을 배경으로 사진을 남기는 포토존'],
      ['04 MINI EVENT', '진주 사투리를 알아보는 가벼운 참여형 퀴즈']
    ]
  }
};
const modal = document.getElementById('info-modal');
if (modal) {
  const dialog = modal.querySelector('.modal-dialog');
  let previousFocus = null;
  function openModal(type) {
    const data = modalData[type];
    if (!data) return;
    previousFocus = document.activeElement;
    document.getElementById('modal-eyebrow').textContent = data.eyebrow;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-content').innerHTML = data.rows.map(([label, body]) =>
      `<div class="modal-row"><strong>${label}</strong><p>${body}</p></div>`
    ).join('') + '<p class="modal-disclaimer">※ 시연을 위해 구성한 가상 프로그램입니다. 실제 운영 정보가 아닙니다.</p>';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    dialog.focus();
  }
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (previousFocus) previousFocus.focus();
  }
  document.querySelectorAll('[data-modal]').forEach(button => button.addEventListener('click', () => openModal(button.dataset.modal)));
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', event => {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeModal();
    // 키보드 Tab 포커스가 팝업 밖으로 빠져나가지 않도록 제한합니다.
    if (event.key === 'Tab') {
      const focusable = [...dialog.querySelectorAll('button,a[href]')];
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
}

/* ===== 03. 사전등록 폼: 서버 없는 시연 버전 ===== */
const registrationForm = document.getElementById('registration-form');
if (registrationForm) {
  registrationForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!registrationForm.reportValidity()) return;
    const name = document.getElementById('guest-name').value.trim();
    const date = document.getElementById('visit-date').value;
    const count = document.getElementById('guest-count').value;
    if (!name) { document.getElementById('guest-name').focus(); return; }
    // 개인 정보는 서버로 전송하거나 저장하지 않습니다. 화면에만 완료 예시를 표시합니다.
    const success = document.getElementById('registration-success');
    document.getElementById('success-name').textContent = name;
    document.getElementById('success-date').textContent = date;
    document.getElementById('success-count').textContent = count;
    registrationForm.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
