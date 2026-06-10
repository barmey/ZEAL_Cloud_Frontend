// src/components/Device3D.js
// Pure-CSS 3D IoT device figures (no extra dependencies).
// Each device is built from cuboid faces inside a preserve-3d container and
// rotates as the page scrolls (rotation prop) on top of a floating animation.

import React from 'react';
import PropTypes from 'prop-types';

const FACE_BORDER = '1px solid rgba(96, 165, 250, 0.35)';

const shades = {
  front: 'linear-gradient(160deg, #16243d 0%, #0b1322 100%)',
  back: '#0a111f',
  side: 'linear-gradient(180deg, #101c31 0%, #081120 100%)',
  top: 'linear-gradient(120deg, #1d2f4f 0%, #11203a 100%)',
  bottom: '#060c17',
};

// A cuboid centered on its parent origin.
const Cuboid = ({ w, h, d, style, children }) => {
  const faces = [
    { t: `translateZ(${d / 2}px)`, fw: w, fh: h, bg: shades.front },
    { t: `rotateY(180deg) translateZ(${d / 2}px)`, fw: w, fh: h, bg: shades.back },
    { t: `rotateY(90deg) translateZ(${w / 2}px)`, fw: d, fh: h, bg: shades.side },
    { t: `rotateY(-90deg) translateZ(${w / 2}px)`, fw: d, fh: h, bg: shades.side },
    { t: `rotateX(90deg) translateZ(${h / 2}px)`, fw: w, fh: d, bg: shades.top },
    { t: `rotateX(-90deg) translateZ(${h / 2}px)`, fw: w, fh: d, bg: shades.bottom },
  ];
  return (
    <div style={{ position: 'absolute', transformStyle: 'preserve-3d', ...style }}>
      {faces.map((f, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: -f.fw / 2,
            top: -f.fh / 2,
            width: f.fw,
            height: f.fh,
            transform: f.t,
            background: f.bg,
            border: FACE_BORDER,
            backfaceVisibility: 'hidden',
          }}
        />
      ))}
      {children}
    </div>
  );
};

const Led = ({ x, y, z, size = 6, color = '#38bdf8', delay = 0 }) => (
  <div
    style={{
      position: 'absolute',
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      transform: `translateZ(${z}px)`,
      animation: `blinkLed 2.4s ease-in-out ${delay}s infinite`,
    }}
  />
);

// --- Devices -------------------------------------------------------------

const CameraDevice = () => (
  <>
    {/* body */}
    <Cuboid w={84} h={48} d={48}>
      {/* lens ring + lens on the front face */}
      <div
        style={{
          position: 'absolute',
          left: -19,
          top: -19,
          width: 38,
          height: 38,
          borderRadius: '50%',
          transform: 'translateZ(25px)',
          background:
            'radial-gradient(circle at 38% 35%, #60a5fa 0%, #1d4ed8 35%, #050b16 75%)',
          border: '2px solid rgba(96, 165, 250, 0.6)',
          boxShadow: '0 0 18px rgba(56, 189, 248, 0.55)',
        }}
      />
      <Led x={30} y={-14} z={25} delay={0.4} />
    </Cuboid>
    {/* mount arm */}
    <Cuboid w={10} h={34} d={10} style={{ transform: 'translateY(40px)' }} />
    {/* base */}
    <Cuboid w={46} h={8} d={46} style={{ transform: 'translateY(58px)' }} />
  </>
);

const SpeakerDevice = () => (
  <>
    <Cuboid w={58} h={92} d={58}>
      {/* speaker grill */}
      <div
        style={{
          position: 'absolute',
          left: -22,
          top: -32,
          width: 44,
          height: 56,
          transform: 'translateZ(30px)',
          borderRadius: 8,
          background:
            'radial-gradient(rgba(96,165,250,0.55) 1.2px, transparent 1.6px)',
          backgroundSize: '7px 7px',
        }}
      />
      <Led x={0} y={36} z={30} color="#60a5fa" delay={0.9} />
    </Cuboid>
    {/* glowing top ring */}
    <div
      style={{
        position: 'absolute',
        left: -25,
        top: -25,
        width: 50,
        height: 50,
        borderRadius: '50%',
        border: '3px solid rgba(56, 189, 248, 0.85)',
        boxShadow: '0 0 20px rgba(56, 189, 248, 0.6)',
        transform: 'rotateX(90deg) translateZ(47px)',
        animation: 'pulseGlow 3s ease-in-out infinite',
      }}
    />
  </>
);

const RouterDevice = () => (
  <>
    <Cuboid w={104} h={20} d={66}>
      <Led x={-36} y={0} z={34} delay={0} />
      <Led x={-20} y={0} z={34} delay={0.5} />
      <Led x={-4} y={0} z={34} delay={1.0} />
      <Led x={12} y={0} z={34} color="#60a5fa" delay={1.5} />
    </Cuboid>
    {/* antennas */}
    <Cuboid w={6} h={52} d={6} style={{ transform: 'translate3d(-34px, -36px, -20px) rotateZ(-8deg)' }} />
    <Cuboid w={6} h={52} d={6} style={{ transform: 'translate3d(34px, -36px, -20px) rotateZ(8deg)' }} />
  </>
);

const SensorDevice = () => (
  <>
    <Cuboid w={64} h={64} d={14}>
      {/* radar sweep dial on the front */}
      <div
        style={{
          position: 'absolute',
          left: -22,
          top: -22,
          width: 44,
          height: 44,
          borderRadius: '50%',
          transform: 'translateZ(8px)',
          border: '2px solid rgba(96, 165, 250, 0.5)',
          background:
            'conic-gradient(from 0deg, rgba(56,189,248,0.5), transparent 70%)',
          animation: 'radarSweep 4s linear infinite',
        }}
      />
      <Led x={22} y={-22} z={8} size={5} delay={0.7} />
    </Cuboid>
  </>
);

const DEVICES = {
  camera: CameraDevice,
  speaker: SpeakerDevice,
  router: RouterDevice,
  sensor: SensorDevice,
};

/**
 * A floating, scroll-rotating 3D device.
 * rotation: degrees of extra Y-rotation (drive it from window scroll).
 */
const Device3D = ({ type, rotation = 0, baseAngle = -24, scale = 1, floatClass = 'float-anim', sx = {} }) => {
  const Body = DEVICES[type] || RouterDevice;
  return (
    <div
      className="device3d"
      aria-hidden="true"
      style={{
        width: 170 * scale,
        height: 170 * scale + 16,
        ...sx,
      }}
    >
      <div className={floatClass} style={{ width: '100%', height: '100%' }}>
        <div
          style={{
            width: 170 * scale,
            height: 170 * scale,
            perspective: 900,
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transformStyle: 'preserve-3d',
              transform: `scale(${scale}) rotateX(-16deg) rotateY(${baseAngle + rotation}deg)`,
              transition: 'transform 0.25s ease-out',
            }}
          >
            <div style={{ position: 'relative', transformStyle: 'preserve-3d' }}>
              <Body />
            </div>
          </div>
          {/* ground glow */}
          <div
            style={{
              margin: '0 auto',
              width: 110 * scale,
              height: 16,
              borderRadius: '50%',
              background:
                'radial-gradient(ellipse at center, rgba(59,130,246,0.4) 0%, transparent 70%)',
              filter: 'blur(4px)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

Device3D.propTypes = {
  type: PropTypes.oneOf(['camera', 'speaker', 'router', 'sensor']),
  rotation: PropTypes.number,
  baseAngle: PropTypes.number,
  scale: PropTypes.number,
  floatClass: PropTypes.string,
  sx: PropTypes.object,
};

export default Device3D;
