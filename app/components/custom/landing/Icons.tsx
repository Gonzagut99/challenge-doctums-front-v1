
interface IconProps {
  className?: string;
  lateralColor?: string;
  centralColor?: string;
}

const ArrowIcon: React.FC<IconProps> = ({ className, lateralColor = 'black', centralColor = 'celeste' }) => (
  <svg
    width="16"
    height="12"
    viewBox="0 0 17 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M16.1505 6.79498C16.4434 6.50209 16.4434 6.02721 16.1505 5.73432L11.3775 0.961348C11.0846 0.668454 10.6097 0.668454 10.3168 0.961348C10.0239 1.25424 10.0239 1.72911 10.3168 2.02201L14.5595 6.26465L10.3168 10.5073C10.0239 10.8002 10.0239 11.2751 10.3168 11.5679C10.6097 11.8608 11.0846 11.8608 11.3775 11.5679L16.1505 6.79498Z"
      fill={lateralColor}
    />
    <path
      d="M0.640137 7.01465H15.6201V5.51465H0.640137V7.01465Z"
      fill={centralColor}
    />
  </svg>
);

const CheckIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 18 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="9" cy="9.02686" r="9" fill="#5A5A5A" />
    <path
      d="M5 8.97231L7.84444 12.0269L13 6.02686"
      stroke="#D5D5D5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const CompetenciaIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <g clipPath="url(#clip0_547_46)">
      <path
        d="M32 38.8572V61.7143"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.5713 61.7141H43.4284"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.9999 25.1429C12.3627 25.1429 8.87439 23.698 6.30247 21.1261C3.73054 18.5541 2.28564 15.0659 2.28564 11.4286V6.85718H18.2856V25.1429H15.9999Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M48.0001 25.1429C51.6373 25.1429 55.1256 23.698 57.6975 21.1261C60.2695 18.5541 61.7144 15.0659 61.7144 11.4286V6.85718H45.7144V25.1429H48.0001Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M45.7142 25.1428C45.7142 28.78 44.2693 32.2683 41.6974 34.8403C39.1255 37.4122 35.6372 38.8571 31.9999 38.8571C28.3627 38.8571 24.8744 37.4122 22.3025 34.8403C19.7305 32.2683 18.2856 28.78 18.2856 25.1428V2.28564H45.7142V25.1428Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_547_46">
        <rect width="64" height="64" rx="11" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
  

const EstrategiaIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M52.5716 22.857C52.5969 19.1851 51.639 15.5733 49.7971 12.3966C47.9553 9.2199 45.2967 6.59411 42.0974 4.79183C38.8981 2.98955 35.2746 2.07647 31.6033 2.14739C27.932 2.21832 24.3465 3.27065 21.2192 5.19516C18.0919 7.11966 15.5367 9.84617 13.8189 13.0916C12.1011 16.3371 11.2834 19.9832 11.4505 23.6514C11.6177 27.3197 12.7637 30.8763 14.7695 33.9521C16.7753 37.0278 19.5679 39.5107 22.8573 41.1428V47.9999C22.8573 48.6061 23.0981 49.1875 23.5268 49.6161C23.9554 50.0448 24.5368 50.2856 25.143 50.2856H38.8573C39.4635 50.2856 40.0449 50.0448 40.4735 49.6161C40.9022 49.1875 41.143 48.6061 41.143 47.9999V41.1428C44.56 39.4592 47.4398 36.8561 49.4588 33.6258C51.4777 30.3956 52.5556 26.6663 52.5716 22.857V22.857Z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22.8574 61.7141H41.1431"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


const ProblemaIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 68 77"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M24.5093 11.7783L26.8149 5.57606C27.2038 4.52595 27.8879 3.6227 28.7777 2.9846C29.6675 2.34651 30.7215 2.00332 31.8016 2H36.1984C37.2785 2.00332 38.3325 2.34651 39.2223 2.9846C40.1121 3.6227 40.7962 4.52595 41.1851 5.57606L43.4907 11.7783L51.3192 16.4719L57.6464 15.4661C58.6999 15.3171 59.7722 15.4978 60.7269 15.9853C61.6817 16.4728 62.4758 17.2451 63.0083 18.204L65.1531 22.1154C65.7027 23.0895 65.956 24.2145 65.8794 25.3417C65.8028 26.469 65.4 27.5456 64.7242 28.4293L60.8099 33.6258V43.013L64.8314 48.2094C65.5072 49.0932 65.91 50.1698 65.9866 51.297C66.0632 52.4243 65.81 53.5492 65.2604 54.5234L63.1156 58.4347C62.583 59.3937 61.7889 60.1659 60.8342 60.6534C59.8794 61.141 58.8071 61.3217 57.7536 61.1727L51.4265 60.1669L43.598 64.8605L41.2923 71.0627C40.9035 72.1128 40.2193 73.0161 39.3296 73.6542C38.4398 74.2923 37.3858 74.6354 36.3057 74.6388H31.8016C30.7215 74.6354 29.6675 74.2923 28.7777 73.6542C27.8879 73.0161 27.2038 72.1128 26.8149 71.0627L24.5093 64.8605L16.6808 60.1669L10.3536 61.1727C9.3001 61.3217 8.22783 61.141 7.27308 60.6534C6.31834 60.1659 5.52422 59.3937 4.99165 58.4347L2.84686 54.5234C2.29726 53.5492 2.04405 52.4243 2.12063 51.297C2.19721 50.1698 2.59999 49.0932 3.27582 48.2094L7.19007 43.013V33.6258L3.16858 28.4293C2.49275 27.5456 2.08997 26.469 2.01339 25.3417C1.93681 24.2145 2.19002 23.0895 2.73962 22.1154L4.88441 18.204C5.41699 17.2451 6.2111 16.4728 7.16584 15.9853C8.12059 15.4978 9.19286 15.3171 10.2464 15.4661L16.5735 16.4719L24.5093 11.7783Z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
  

  const RealistaIcon = () => (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_547_70)">
        <path
          d="M31.9999 61.7142C48.4107 61.7142 61.7142 48.4107 61.7142 31.9999C61.7142 15.5892 48.4107 2.28564 31.9999 2.28564C15.5892 2.28564 2.28564 15.5892 2.28564 31.9999C2.28564 48.4107 15.5892 61.7142 31.9999 61.7142Z"
          stroke="#020202"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.57129 43.4286H12.5713C14.693 43.4286 16.7279 42.5857 18.2281 41.0854C19.7284 39.5851 20.5713 37.5503 20.5713 35.4286V28.5714C20.5713 26.4497 21.4141 24.4149 22.9144 22.9146C24.4147 21.4143 26.4496 20.5714 28.5713 20.5714C30.693 20.5714 32.7279 19.7286 34.2281 18.2283C35.7284 16.728 36.5713 14.6932 36.5713 12.5714V2.60571"
          stroke="#020202"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M61.7141 31.5427C59.4253 30.3551 56.887 29.7283 54.3084 29.7141H44.5713C42.4496 29.7141 40.4147 30.557 38.9144 32.0573C37.4141 33.5575 36.5713 35.5924 36.5713 37.7141C36.5713 39.8358 37.4141 41.8707 38.9144 43.371C40.4147 44.8713 42.4496 45.7141 44.5713 45.7141C46.0868 45.7141 47.5403 46.3161 48.6119 47.3878C49.6835 48.4594 50.2856 49.9129 50.2856 51.4284V55.4055"
          stroke="#020202"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_547_70">
          <rect width="64" height="64" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
  
  const RecursosIcon = () => (
    <svg
      width="60"
      height="60"
      viewBox="0 0 68 77"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M41.3846 2H6.92308C5.6174 2 4.36519 2.59079 3.44194 3.64241C2.51868 4.69402 2 6.12032 2 7.60753V69.2903C2 70.7775 2.51868 72.2038 3.44194 73.2554C4.36519 74.3071 5.6174 74.8978 6.92308 74.8978H61.0769C62.3826 74.8978 63.6348 74.3071 64.5581 73.2554C65.4813 72.2038 66 70.7775 66 69.2903V30.0376L41.3846 2Z"
        stroke="#020202"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M41.3843 27.2339V2L65.9997 30.0376H43.8458C43.193 30.0376 42.5669 29.7422 42.1052 29.2164C41.6436 28.6906 41.3843 27.9775 41.3843 27.2339Z"
        stroke="#020202"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.6924 24.4301V16.0188"
        stroke="#020202"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.3076 46.8603C14.3076 51.0659 17.6061 52.4678 21.6922 52.4678C25.7784 52.4678 29.0768 52.4678 29.0768 46.8603C29.0768 38.449 14.3076 38.449 14.3076 30.0377C14.3076 24.4302 17.6061 24.4302 21.6922 24.4302C25.7784 24.4302 29.0768 26.561 29.0768 30.0377"
        stroke="#020202"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.6924 52.4678V60.8791"
        stroke="#020202"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M41.3843 52.4678H56.1535"
        stroke="#020202"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

export {ArrowIcon, CheckIcon, CompetenciaIcon,EstrategiaIcon,ProblemaIcon,RealistaIcon,RecursosIcon}

