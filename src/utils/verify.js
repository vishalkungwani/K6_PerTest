import { check } from 'k6';

export function verify(res){
    check(res, {
        'Check status is 200': (r) => res.status === 200,
        'Check Content-Type header': (r) => res.headers['Content-Type'] === 'application/json',
        'Check transaction time OK': (r) => res.timings.duration < 1000
      });
}